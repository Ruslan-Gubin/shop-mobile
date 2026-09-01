import type { OrderStatus } from "../types/order";

export const orderStatusLabels: Record<OrderStatus, string> = {
  new: "Новый",
  cancelled_new: "Отменён",
  processing: "В обработке",
  cancelled_assembly: "Отменён",
  ready: "Готов к выдаче",
  in_delivery: "В доставке",
  cancelled_delivery: "Отменён",
  completed: "Выполнен",
  cancelled_customer: "Отменён",
};

export const orderStatusColors: Record<OrderStatus, string> = {
  new: "#3b82f6",
  cancelled_new: "#ef4444",
  processing: "#f59e0b",
  cancelled_assembly: "#ef4444",
  ready: "#22c55e",
  in_delivery: "#8b5cf6",
  cancelled_delivery: "#ef4444",
  completed: "#22c55e",
  cancelled_customer: "#ef4444",
};

export const getOrderStatusLabel = (status: OrderStatus): string =>
  orderStatusLabels[status] ?? status;

export const getOrderStatusColor = (status: OrderStatus): string =>
  orderStatusColors[status] ?? "#868695";
