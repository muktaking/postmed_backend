import { Controller, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import BkashGateway = require('bkash-payment-gateway');

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async bkashPaymentGateWay() {
    const bkashConfig = {
      baseURL: 'https://checkout.sandbox.bka.sh/v1.2.0-beta', //do not add a trailing slash
      key: 'abcdxx2369',
      username: 'bkashTest',
      password: 'bkashPassword1',
      secret: 'bkashSup3rS3cRet',
    };

    const bkash = new BkashGateway(bkashConfig);
    return await this.paymentService.bkashPayment(bkash);
  }
}
