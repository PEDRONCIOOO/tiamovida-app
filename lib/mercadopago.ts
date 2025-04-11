import { MercadoPagoConfig, Payment } from 'mercadopago';

interface CustomPaymentCreateData {
  body: {
    transaction_amount: number;
    description: string;
    payment_method_id: string;
    payer: {
      email: string;
      first_name: string;
      last_name: string;
    };
    external_reference: string;
  }
}

// Configurar SDK do Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string 
});

const payment = new Payment(client);

/**
 * Cria um pagamento via PIX no Mercado Pago
 */
export async function createPixPayment(data: {
  transactionAmount: number;
  description: string;
  payerEmail: string;
  payerFirstName: string;
  payerLastName: string;
  externalReference: string;
}) {
  try {
    const { 
      transactionAmount, 
      description, 
      payerEmail, 
      payerFirstName, 
      payerLastName,
      externalReference 
    } = data;

    // Usando o casting para nossa interface personalizada
    const paymentResponse = await payment.create({
      transaction_amount: transactionAmount,
      description,
      payment_method_id: 'pix',
      payer: {
        email: payerEmail,
        first_name: payerFirstName,
        last_name: payerLastName,
      },
      external_reference: externalReference,
    } as unknown as CustomPaymentCreateData);

    return {
      success: true,
      paymentId: paymentResponse.id,
      pixQrCode: paymentResponse.point_of_interaction?.transaction_data?.qr_code,
      pixQrCodeBase64: paymentResponse.point_of_interaction?.transaction_data?.qr_code_base64,
      expirationDate: paymentResponse.date_of_expiration,
    };
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar pagamento PIX',
    };
  }
}

/**
 * Verifica o status de um pagamento no Mercado Pago
 */
export async function checkPaymentStatus(paymentId: string) {
  try {
    const response = await payment.get({ id: paymentId });
    
    return {
      success: true,
      status: response.status,
      statusDetail: response.status_detail,
      externalReference: response.external_reference,
    };
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao verificar status do pagamento',
    };
  }
}
