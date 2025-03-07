import feeTable from "@/config/feeTable";

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
  let deliveryFee = 0;
  let serviceFee = 0;

  for (let row of feeTable) {
    if (orderValue >= row.range[0] && orderValue <= row.range[1]) {
      deliveryFee =
        distance <= 1 ? row.fees[0] : distance <= 2 ? row.fees[1] : row.fees[2];
      serviceFee = row.serviceFee;
      break;
    }
  }

  if (orderValue > 50) {
    serviceFee = 0.8;
    deliveryFee = distance <= 1 ? 0 : distance <= 2 ? 0.5 : 0.79;
  }

  const totalCost = orderValue + deliveryFee + serviceFee;
  const vat = totalCost * 0.2;
  const finalTotal = totalCost + vat;

  return {
    deliveryFee: parseFloat(deliveryFee.toFixed(2)),
    serviceFee: parseFloat(serviceFee.toFixed(2)),
    vat: parseFloat(vat.toFixed(2)),
    finalTotal: parseFloat(finalTotal.toFixed(2)),
  } as const;
};
