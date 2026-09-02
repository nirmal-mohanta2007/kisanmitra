import { PaymentService } from '../../src/features/payment/payment.service';

describe('Payment Engine', () => {
  it('should calculate payment correctly', () => {
    const msp = 2000;
    const netWeight = 50;
    
    const payment = PaymentService.calculateTotalAmount(msp, netWeight);
    expect(payment).toBe(100000);
  });

  it('should handle zero weight', () => {
    const payment = PaymentService.calculateTotalAmount(2000, 0);
    expect(payment).toBe(0);
  });
});
