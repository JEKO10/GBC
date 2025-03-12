export interface FeeCalculationResult {
  deliveryFee: number;
  serviceFee: number;
  vat: number;
  finalTotal: number;
}

export const calculateFees = (orderValue: number): FeeCalculationResult => {
  const deliveryFee = 1.8;
  let serviceFee = 0;

  if (orderValue >= 8 && orderValue <= 15) {
    serviceFee = orderValue * 0.1;
  } else if (orderValue >= 16 && orderValue <= 50) {
    serviceFee = orderValue * 0.07;
  } else if (orderValue >= 51) {
    serviceFee = orderValue * 0.05;
  }

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
