export const MP_BASE_URL = 'https://api.mercadopago.com';
export const MP_TOKEN = process.env.MERCADO_PAGO_TOKEN;

interface PixPaymentData {
  transaction_amount: number;
  description: string;
  payment_method_id: string;
  payer: {
    email: string;
    identification?: {
      type: string;
      number: string;
    };
  };
}

export async function createPixPayment(data: PixPaymentData) {
  const res = await fetch(`${MP_BASE_URL}/v1/payments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}