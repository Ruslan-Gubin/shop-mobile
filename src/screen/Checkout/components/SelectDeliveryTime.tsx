import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const getDayTimes = (selectDate: string, todayDate: Date, end: number) => {
  const times: number[] = [];

  const isSelectToday = new Date(selectDate).toDateString() === todayDate.toDateString();

  let startHour = 10;

  if (isSelectToday) {
    const currentHours = todayDate.getHours();
    startHour = currentHours < 8 ? 10 : currentHours + 2;
  }

  for (let i = startHour; i < end; i++) {
    times.push(i);
  }

  return times;
};

type Props = {
  onChange: (time: number) => void;
  date: string;
  todayDate: Date;
  time: number;
  endWork: number;
};

export const SelectDeliveryTime = ({ onChange, date, todayDate, time, endWork }: Props) => {
  const rangeTimes = getDayTimes(date, todayDate, endWork);

  if (rangeTimes.length === 0) {
    return null;
  }

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
        {rangeTimes.map((item) => (
          <Pressable
            key={item}
            style={[styles.calendarItem, time === item && styles.selectDate]}
            onPress={() => onChange(item)}
          >
            <Text style={[styles.calendarNumber, time === item && styles.selectDateText]}>
              с {item}:00
            </Text>
            <Text style={[styles.calendarNumber, time === item && styles.selectDateText]}>
              до {item + 1}:00
            </Text>
          </Pressable>
        ))}
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
  selectDate: {
    backgroundColor: "#fff",
    borderColor: "#ffcb54",
  },
  selectDateText: {
    color: "#242424",
  },
  calendarNumber: {
    fontSize: 14,
    color: "#868695",
  },
});