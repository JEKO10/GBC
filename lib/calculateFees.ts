export interface FeeCalculationResult {
  deliveryFee: number;
  serviceFee: number;
  // totalCost: number;
  vat: number;
  finalTotal: number;
}

export const calculateFees = (
  orderValue: number,
  distance: number
): FeeCalculationResult => {
  const feeTable = [
    { range: [8, 9.99], fees: [0.99, 1.5, 2], serviceFee: 0.8 },
    { range: [10, 11.99], fees: [0.99, 1.5, 2], serviceFee: 0.9 },
    { range: [12, 15], fees: [0.79, 1.2, 1.8], serviceFee: 1.0 },
    { range: [15.01, 20], fees: [0.5, 1, 1.5], serviceFee: 1.0 },
    { range: [20.01, 25], fees: [0.29, 0.79, 1], serviceFee: 0.9 },
    { range: [25.01, 50], fees: [0, 0.5, 0.79], serviceFee: 0.8 },
  ];

  let deliveryFee = 0;
  let serviceFee = 0;

  for (let row of feeTable) {
    if (orderValue >= row.range[0] && orderValue <= row.range[1]) {
      if (distance <= 1) deliveryFee = row.fees[0];
      else if (distance <= 2) deliveryFee = row.fees[1];
      else deliveryFee = row.fees[2];

      serviceFee = row.serviceFee;
      break;
    }
  }

  if (orderValue > 50) {
    deliveryFee = 0;
    serviceFee = 0.8;
    if (distance <= 1) deliveryFee = 0;
    else if (distance <= 2) deliveryFee = 0.5;
    else deliveryFee = 0.79;
  }

  const totalCost = orderValue + deliveryFee + serviceFee;
  const vat = totalCost * 0.2;
  const finalTotal = totalCost + vat;

  return { deliveryFee, serviceFee, vat, finalTotal };
};
