export const config = {
  port: Number(process.env.PORT ?? 3000),
  // Payment gateway used when a booking is confirmed.
  paymentApiKey: process.env.PAYMENT_API_KEY ?? 'demo-payment-key-do-not-use-1234',
};
