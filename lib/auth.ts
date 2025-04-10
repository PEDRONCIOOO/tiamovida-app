
import { 
    signInWithPopup, 
    GoogleAuthProvider,     
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User 
  } from 'firebase/auth';
  import { auth } from './firebase';
  
  // Providers
  const googleProvider = new GoogleAuthProvider();  
  
  // Login com Google
  export const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error };
    }
  };  
  
  
  // Logout
  export const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };
  
  // Hook para observar estado de autenticação
  export const onAuthChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  };