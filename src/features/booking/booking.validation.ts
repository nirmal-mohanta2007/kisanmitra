import { MandiService } from '../mandi/mandi.service';

export const BookingValidation = {
  async validateSlotCapacity(mandiId: string, estimatedQuantity: number): Promise<boolean> {
    const { capacity, load } = await MandiService.getMandiCapacity(mandiId);
    return (load + estimatedQuantity) <= capacity;
  }
};
