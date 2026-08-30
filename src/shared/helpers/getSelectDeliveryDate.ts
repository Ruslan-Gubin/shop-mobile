export const getSelectDeliveryDate = (delivery_date: string) => {
  const nowDate = new Date();
  const nowDateString = nowDate.toDateString();

  return !delivery_date || new Date(nowDateString) > new Date(delivery_date)
    ? nowDateString
    : delivery_date;
};