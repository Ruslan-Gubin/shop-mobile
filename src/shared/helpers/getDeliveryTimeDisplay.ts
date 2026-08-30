export const getDeliveryTimeDisplay = (
  delivery_date: string,
  delivery_time: number,
  startWork: number,
  endWork: number,
) => {
  if (delivery_time) {
    return `с ${delivery_time}:00 до ${delivery_time + 1}:00`;
  }

  const nowDate = new Date();
  const selectDeliveryDate =
    !delivery_date || new Date(nowDate.toDateString()) > new Date(delivery_date)
      ? nowDate.toDateString()
      : delivery_date;
  const isToday = nowDate.toDateString() === selectDeliveryDate;

  if (isToday) {
    const currentHours = nowDate.getHours();
    const startHour = currentHours < 8 ? startWork : Math.min(currentHours + 2, endWork - 1);
    return `с ${startHour}:00 до ${endWork}:00`;
  }

  return `с ${startWork}:00 до ${endWork}:00`;
};