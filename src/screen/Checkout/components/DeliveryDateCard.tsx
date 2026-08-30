import { getSelectDeliveryDate } from "../../../shared/helpers/getSelectDeliveryDate";
import { checkoutAdapter } from "../../../store/checkout/adapter";
import { checkoutStore } from "../../../store/checkout/store";
import { InfoCard } from "./InfoCard";
import { SelectDeliveryTime } from "./SelectDeliveryTime";
import { SelectWeekDate } from "./SelectWeekDate";

export const DeliveryDateCard = () => {
  const delivery_date = checkoutStore((store) => store.delivery_date);
  const delivery_time = checkoutStore((store) => store.delivery_time);
  const endWork = 19;

  const nowDate = new Date();
  const selectDeliveryDate = getSelectDeliveryDate(delivery_date);

  const handleChangeDeliveryDate = (value: string) => {
    let updateDate = value === delivery_date ? nowDate.toDateString() : value;

    const isSelectToday = nowDate.toDateString() === updateDate;

    if (isSelectToday) {
      const currentHours = nowDate.getHours();

      if (endWork - currentHours < 3) {
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        updateDate = nextDay.toDateString();
      } else {
        if (delivery_time && delivery_time < currentHours + 2) {
          checkoutAdapter.setDeliveryTime(currentHours + 2);
        }
      }
    }

    checkoutAdapter.setDeliveryDate(updateDate);
  };

  const handleChangeDeliveryTime = (value: number) => {
    checkoutAdapter.setDeliveryTime(value);
  };

  return (
    <InfoCard title="Дата и время">
      <SelectWeekDate
        todayDate={nowDate}
        date={selectDeliveryDate}
        onChange={handleChangeDeliveryDate}
        countDay={11}
        endWork={endWork}
      />
      <SelectDeliveryTime
        todayDate={nowDate}
        date={selectDeliveryDate}
        onChange={handleChangeDeliveryTime}
        time={delivery_time}
        endWork={endWork}
      />
    </InfoCard>
  );
};