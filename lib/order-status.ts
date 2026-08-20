export const orderTransitions = {
  PENDING: ["PAYMENT_PENDING", "PAID", "CANCELLED"],
  PAYMENT_PENDING: ["PAID", "CANCELLED"],
  PAID: ["PROCESSING", "REFUND_REQUESTED", "REFUNDED"],
  PROCESSING: ["PACKED", "CANCELLED"],
  PACKED: ["SHIPPED"],
  SHIPPED: ["DELIVERED", "REFUND_REQUESTED"],
  DELIVERED: ["REFUND_REQUESTED"],
  CANCELLED: [],
  REFUND_REQUESTED: ["REFUNDED"],
  REFUNDED: [],
} as const;

export type OrderLifecycleStatus = keyof typeof orderTransitions;
export function canTransitionOrder(
  from: OrderLifecycleStatus,
  to: OrderLifecycleStatus,
) {
  return orderTransitions[from].includes(to as never);
}
