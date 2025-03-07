const feeTable = [
  { range: [8, 9.99], fees: [0.99, 1.5, 2], serviceFee: 0.8 },
  { range: [10, 11.99], fees: [0.99, 1.5, 2], serviceFee: 0.9 },
  { range: [12, 15], fees: [0.79, 1.2, 1.8], serviceFee: 1.0 },
  { range: [15.01, 20], fees: [0.5, 1, 1.5], serviceFee: 1.0 },
  { range: [20.01, 25], fees: [0.29, 0.79, 1], serviceFee: 0.9 },
  { range: [25.01, 50], fees: [0, 0.5, 0.79], serviceFee: 0.8 },
];

export default feeTable;
