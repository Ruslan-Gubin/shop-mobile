export const getDateFromAndDateTo = (
  delivery_date: string,
  delivery_time: number,
  startWork: number,
  endWork: number,
): { date_from: Date; date_to: Date } => {
  const nowDate = new Date();

  const selectDate = delivery_date ? new Date(delivery_date) : new Date();

  const selectStartHours = delivery_time ? delivery_time : startWork;
  const selectEndHours = delivery_time ? delivery_time + 1 : endWork;

  const date_from = new Date(selectDate);
  const date_to = new Date(selectDate);

  date_from.setHours(selectStartHours);
  date_to.setHours(selectEndHours);

  const isSelectToday = nowDate.toDateString() === selectDate.toDateString();
  const isSelectPrevDate = nowDate > selectDate;

  if (isSelectToday || isSelectPrevDate) {
    const currentHours = nowDate.getHours();

    if (endWork - currentHours < 3) {
      date_from.setDate(nowDate.getDate() + 1);
      date_to.setDate(nowDate.getDate() + 1);
    } else {
      date_from.setDate(nowDate.getDate());
      date_to.setDate(nowDate.getDate());
    }
  }

  return { date_from, date_to };
};