export const statusOrder = [
  "Pending",
  "Preparing",
  "Ready",
  "Dispatched",
  "Completed",
  "Cancelled",
] as const;

export type OrderStatus = (typeof statusOrder)[number];
