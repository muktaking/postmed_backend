import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor() {}

  async bkashPayment(bkash) {
    const paymentRequest = {
      amount: 1000,
      orderID: 'ORD1020069',
      intent: 'sale',
    };

    const result = await bkash.createPayment(paymentRequest);
    console.log(result);
    return result;
  }
}
