import type { OrderStatus } from "../types/order";

export const orderStatusLabels: Record<OrderStatus, string> = {
  new: "Новый",
  cancelled_new: "Отменён на этапе оформления",
  processing: "В обработке",
  cancelled_assembly: "Отменён в процессе сборки",
  ready: "Готов",
  cancelled_ready: "Отменён на этапе выдачи",
  in_delivery: "В доставке",
  cancelled_delivery: "Отменён на этапе доставки",
  completed: "Завершён",
  cancelled_customer: "Отменён покупателем",
};

export const orderStatusColors: Record<OrderStatus, string> = {
  new: "#3b82f6",
  cancelled_new: "#ef4444",
  processing: "#f59e0b",
  cancelled_assembly: "#ef4444",
  ready: "#22c55e",
  cancelled_ready: "#ef4444",
  in_delivery: "#8b5cf6",
  cancelled_delivery: "#ef4444",
  completed: "#22c55e",
  cancelled_customer: "#ef4444",
};

export const getOrderStatusLabel = (status: OrderStatus): string =>
  orderStatusLabels[status] ?? status;

export const getOrderStatusColor = (status: OrderStatus): string =>
  orderStatusColors[status] ?? "#868695";
