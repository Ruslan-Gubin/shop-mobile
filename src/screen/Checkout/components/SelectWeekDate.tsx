import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const getWeekDays = (dateFrom: Date, countDay: number, end: number) => {
  const dates: Date[] = [];
  let incrementDay = 0;

  const currentHours = dateFrom.getHours();
  if (end - currentHours < 3) {
    incrementDay = 1;
  }

  for (let i = incrementDay; i < countDay + incrementDay; i++) {
    const newDate = new Date(dateFrom);
    newDate.setDate(dateFrom.getDate() + i);
    dates.push(newDate);
  }

  return dates;
};

type Props = {
  countDay: number;
  onChange: (date: string) => void;
  date: string;
  todayDate: Date;
  endWork: number;
};

export const SelectWeekDate = ({ countDay, onChange, date, todayDate, endWork }: Props) => {
  const rangeDate = getWeekDays(todayDate, countDay, endWork);

  const weekList = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const checkIsToday = (item: Date): boolean => item.toDateString() === todayDate.toDateString();

  const formatterDay = new Intl.DateTimeFormat("ru", {
    day: "2-digit",
    month: "short",
  });

  return (
    <View style={styles.calendarList}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={90 + 12}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={styles.calendarScrollContent}
      >
        {rangeDate.map((item) => {
          const isToday = checkIsToday(item);
          const isSelected = item.toDateString() === date;

          return (
            <Pressable
              key={item.toString()}
              style={[
                styles.calendarItem,
                isToday && styles.calendarItemActive,
                isSelected && styles.selectDate,
              ]}
              onPress={() => onChange(item.toDateString())}
            >
              <Text style={[styles.calendarDay, isSelected && styles.selectDateText]}>
                {weekList[item.getDay() - 1] ?? "Вс"},
              </Text>
              <Text style={[styles.calendarNumber, isSelected && styles.selectDateText]}>
                {formatterDay.format(item)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarList: {
    borderRadius: 12,
    backgroundColor: "#25507e05",
    borderWidth: 1,
    borderColor: "#f1f1f5",
    paddingVertical: 12,
  },
  calendarScrollContent: {
    paddingHorizontal: 12,
    columnGap: 12,
  },
  calendarItem: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    rowGap: 4,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ededed",
    width: 90,
    height: 70,
  },
  calendarItemActive: {
    borderStyle: "dashed",
    borderColor: "lightgray",
  },
  selectDate: {
    backgroundColor: "#fff",
    borderStyle: "solid",
    borderColor: "#ffcb54",
  },
  selectDateText: {
    color: "#242424",
  },
  calendarDay: {
    fontSize: 12,
    color: "#868695",
  },
  calendarNumber: {
    fontSize: 14,
    color: "#868695",
  },
});
