import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { 
  doc, getDoc, setDoc, collection, query, where, getDocs 
} from 'firebase/firestore';
import { 
  ref, getDownloadURL, listAll, getMetadata, getBlob, uploadBytes 
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Generate a unique slug
async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 0;
  const lettersCollection = collection(db, 'loveLetters');
  
  // Keep checking until we find a unique slug
  while (true) {
    const q = query(lettersCollection, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return slug; // Found a unique slug
    }
    
    // Try with a counter appended
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${message}`);
    return res.status(400).send(`Webhook Error: ${message}`);
  }

  // Handle successful payments
  if (event.type === 'checkout.session.completed') {
    try {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Get the metadata from the session
      const { temporaryId, plan, coupleNames } = session.metadata || {};
      
      if (!temporaryId || !plan || !coupleNames) {
        throw new Error('Missing required metadata');
      }

      // 1. Get the temporary letter data
      const tempLetterRef = doc(db, 'tempLetters', temporaryId);
      const tempLetterSnap = await getDoc(tempLetterRef);
      
      if (!tempLetterSnap.exists()) {
        throw new Error(`No temporary data found for ID: ${temporaryId}`);
      }
      
      const tempData = tempLetterSnap.data();
      
      // 2. Get the temporary photos from storage
      const photoListRef = ref(storage, `temp-uploads/${temporaryId}`);
      const photoList = await listAll(photoListRef);
      
      // Process each photo - copy from temp to permanent storage
      const photoUrls: string[] = [];
      
      // Generate a unique slug for this letter
      const uniqueSlug = await generateUniqueSlug(tempData.baseSlug);
      
      // Process each file and copy to permanent storage
      for (const photoRef of photoList.items) {
        const photoBlob = await getBlob(photoRef);
        const metadata = await getMetadata(photoRef);
        const fileName = metadata.name || `photo-${photoUrls.length + 1}.jpg`;
        
        // Upload to permanent location
        const permanentRef = ref(storage, `loveLetters/${uniqueSlug}/${fileName}`);
        await uploadBytes(permanentRef, photoBlob);
        
        // Get the public URL
        const photoUrl = await getDownloadURL(permanentRef);
        photoUrls.push(photoUrl);
      }
      
      // 3. Create the final love letter data
      const letterData = {
        slug: uniqueSlug,
        plan: plan,
        coupleNames: coupleNames,
        relationshipDate: tempData.relationshipDate,
        startTime: tempData.startTime,
        message: tempData.message,
        photoUrls: photoUrls,
        musicLink: tempData.musicLink,
        createdAt: new Date(),
        paidAt: new Date(),
        stripeSessionId: session.id,
        validUntil: plan === 'basic' 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
          : null // null means forever
      };
      
      // 4. Save to Firestore
      await setDoc(doc(db, 'loveLetters', uniqueSlug), letterData);
      
      console.log(`Created love letter with slug: ${uniqueSlug}`);
      
      // 5. Update temp letter status to completed
      await setDoc(tempLetterRef, { 
        status: 'completed',
        finalSlug: uniqueSlug 
      }, { merge: true });
      
      // Success!
      res.status(200).json({ received: true });
      
    } catch (error: unknown) {
      console.error('Error processing webhook:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      // Still return 200 to Stripe (to prevent retries) but log the error
      res.status(200).json({ received: true, error: errorMessage });
    }
  } else {
    // For other event types, just acknowledge receipt
    res.status(200).json({ received: true });
  }
}