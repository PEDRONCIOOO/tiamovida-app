import mercadopago from 'mercadopago';

// Configurar SDK do Mercado Pago
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
});

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

    const payment = await mercadopago.payment.create({
      transaction_amount: transactionAmount,
      description,
      payment_method_id: 'pix',
      payer: {
        email: payerEmail,
        first_name: payerFirstName,
        last_name: payerLastName,
      },
      external_reference: externalReference,
    });

    return {
      success: true,
      paymentId: payment.body.id,
      pixQrCode: payment.body.point_of_interaction.transaction_data.qr_code,
      pixQrCodeBase64: payment.body.point_of_interaction.transaction_data.qr_code_base64,
      expirationDate: payment.body.date_of_expiration,
    };
  } catch (error: any) {
    console.error('Erro ao criar pagamento PIX:', error);
    return {
      success: false,
      error: error.message || 'Erro ao criar pagamento PIX',
    };
  }
}

/**
 * Verifica o status de um pagamento no Mercado Pago
 */
export async function checkPaymentStatus(paymentId: string) {
  try {
    const response = await mercadopago.payment.get(parseInt(paymentId));
    
    return {
      success: true,
      status: response.body.status,
      statusDetail: response.body.status_detail,
      externalReference: response.body.external_reference,
    };
  } catch (error: any) {
    console.error('Erro ao verificar status do pagamento:', error);
    return {
      success: false,
      error: error.message || 'Erro ao verificar status do pagamento',
    };
  }
}