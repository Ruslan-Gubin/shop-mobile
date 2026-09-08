import { StyleSheet, Text, View } from "react-native";
import { formatDateRu, formatDeliveryInterval } from "../../../shared/helpers/formatters";
import { getFullAddressItem } from "../../../shared/helpers/getFullAddressItem";
import type { AddressItem } from "../../../store/checkout/types";
import { MapBox } from "../../Checkout/components/map/MapBox";

type Props = {
  method_receipt: string;
  status: string;
  recipient_name: string;
  phoneCode: string;
  phone: string;
  comment: string;
  address?: AddressItem | null;
  date_from: Date | null;
  date_to: Date | null;
  updated_at: Date | null;
};

export const DeliveryInfo = (props: Props) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {props.method_receipt === "courier" ? "Доставка" : "Самовывоз"}
      </Text>
      {typeof props.date_from === "string" && props.date_from && (
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>
            {props.method_receipt === "courier" ? "Дата доставки" : "Дата выдачи"}
          </Text>
          <Text style={styles.cardValue}>
            {formatDeliveryInterval(props.date_from, props.date_to)}
          </Text>
        </View>
      )}
      {typeof props.status === "string" &&
        props.status === "completed" &&
        typeof props.updated_at === "string" &&
        props.updated_at && (
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Дата выдачи</Text>
            <Text style={styles.cardValue}>
              {formatDateRu(props.updated_at, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        )}
      {typeof props.recipient_name === "string" && props.recipient_name.length > 0 && (
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Получатель</Text>
          <Text style={styles.cardValue}>{props.recipient_name}</Text>
        </View>
      )}
      {typeof props.phone === "string" && props.phone.length > 0 && (
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Телефон</Text>
          <Text style={styles.cardValue}>
            {props.phoneCode}
            {props.phone}
          </Text>
        </View>
      )}
      {typeof props.comment === "string" && props.comment.length > 0 && (
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>
            Комментарий: <Text>{props.comment}</Text>
          </Text>
        </View>
      )}
      {props.address && (
        <Text style={styles.rejectedText}>
          <Text style={styles.infoLabel}>
            {props.method_receipt === "courier" ? "Адрес: " : "Склад"}{" "}
          </Text>
          {getFullAddressItem(props.address)}
        </Text>
      )}
      {props.address &&
        typeof props.address.lat === "number" &&
        typeof props.address.lng === "number" &&
        !Number.isNaN(props.address.lat) &&
        !Number.isNaN(props.address.lng) &&
        props.address.lng >= -180 &&
        props.address.lng <= 180 &&
        props.address.lat >= -90 &&
        props.address.lat <= 90 && (
          <View style={styles.mapContainer}>
            <MapBox
              markers={[props.address]}
              onClickMarker={() => {}}
              initCenter={{ lat: props.address.lat, lng: props.address.lng }}
              active={{ lat: props.address.lat, lng: props.address.lng }}
            />
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  infoLabel: {
    fontSize: 14,
    fontWeight: "400",
    color: "#242424",
  },
  card: {
    rowGap: 12,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#242424",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 12,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "400",
    color: "#242424",
  },
  cardValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "500",
    color: "#242424",
  },
  rejectedText: {
    fontSize: 14,
    color: "#242424",
  },
  mapContainer: {
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
  },
});
