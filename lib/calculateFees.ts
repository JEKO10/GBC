export interface FeeCalculationResult {
  deliveryFee: number;
  serviceFee: number;
  vat: number;
  finalTotal: number;
}

export const calculateFees = (orderValue: number): FeeCalculationResult => {
  const deliveryFee = 1.8;
  let serviceFee = 0;

  switch (true) {
    case orderValue >= 8 && orderValue <= 15:
      serviceFee = orderValue * 0.1;
      break;
    case orderValue >= 16 && orderValue <= 50:
      serviceFee = orderValue * 0.07;
      break;
    case orderValue > 50:
      serviceFee = orderValue * 0.05;
      break;
    default:
      serviceFee = 0;
  }

  // @TODO WAT nakon ili prije delivery
  // const subtotal = orderValue + serviceFee;
  // const vat = subtotal * 0.2;
  // const finalTotal = subtotal + vat + deliveryFee;

  const totalCost = orderValue + deliveryFee + serviceFee;
  const vat = totalCost * 0.2;
  const finalTotal = totalCost + vat;

  return {
    deliveryFee: parseFloat(deliveryFee.toFixed(2)),
    serviceFee: parseFloat(serviceFee.toFixed(2)),
    vat: parseFloat(vat.toFixed(2)),
    finalTotal: parseFloat(finalTotal.toFixed(2)),
  };
};
