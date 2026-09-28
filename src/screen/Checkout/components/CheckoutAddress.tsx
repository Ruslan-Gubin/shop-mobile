import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatterRub } from "../../../shared/helpers/formatters";
import { getFullAddressItem } from "../../../shared/helpers/getFullAddressItem";
import { PinAddressSvg } from "../../../shared/svg/PinAddressSvg";
import { checkoutAdapter } from "../../../store/checkout/adapter";
import { checkoutStore } from "../../../store/checkout/store";
import type { AddressItem } from "../../../store/checkout/types";
import { ModalSelectAddress } from "./ModalSelectAddress";
import { MapBox } from "./map/MapBox";

type Props = {
  pickupAddress: AddressItem[];
  defaultCenter: { lng: number; lat: number };
  navigation: NativeStackNavigationProp<ParamListBase, "Checkout">;
  method_receipt: "pickup" | "courier";
  minOrderSum: number;
  selectModal: boolean;
  setSelectModal: (value: boolean) => void;
  isDeliveryCourier: boolean;
  address: AddressItem | null;
};

export const CheckoutAddress = (props: Props) => {
  const activePickup = checkoutStore((store) => store.activePickup);
  const activeCourier = checkoutStore((store) => store.activeCourier);
  const courierAddress = checkoutStore((store) => store.courierAddress);

  const filterAddress = props.method_receipt === "pickup" ? props.pickupAddress : courierAddress;

  const selectAddress = props.address
    ? (filterAddress.find(
        (el) => props.address && el.lng === props.address.lng && el.lat === props.address.lat,
      ) ?? null)
    : null;

  const handleClickAddAddress = () => {
    props.setSelectModal(false);
    props.navigation.navigate("AddAddress");
  };

  const hasActive =
    (props.method_receipt === "courier" && activeCourier) ||
    (props.method_receipt === "pickup" && activePickup);

  return (
    <View style={styles.root}>
      <ModalSelectAddress
        isDeliveryCourier={props.isDeliveryCourier}
        active={props.selectModal}
        onClose={() => props.setSelectModal(false)}
        onAddAddress={handleClickAddAddress}
        method_receipt={props.method_receipt}
        pickupAddress={props.pickupAddress}
        courierAddress={courierAddress}
        defaultCenter={props.defaultCenter}
        activePickup={activePickup}
        activeCourier={activeCourier}
      />

      {selectAddress && (
        <View style={styles.activeMarker}>
          <PinAddressSvg size={32} />
          <View style={styles.activeMarkerInfo}>
            <Text style={styles.leftSideTitle}>
              {selectAddress.type === "courier" ? "Курьером по адресу:" : "Адрес самовывоза:"}
            </Text>
            <Text style={styles.activeMarkerAddressText}>{getFullAddressItem(selectAddress)}</Text>
            {props.minOrderSum > 0 && (
              <Text style={styles.activeMarkerAddressText}>
                Минимальная сумма заказа {formatterRub.format(props.minOrderSum)}.
              </Text>
            )}
            <Text style={styles.activeMarkerAddressText}>
              Способ оплаты: наличными или оплата картой по терминалу.
            </Text>
          </View>
        </View>
      )}

      <View style={styles.leftSideFooter}>
        <Pressable style={styles.button} onPress={() => props.setSelectModal(true)}>
          <Text style={styles.buttonText}>{hasActive ? "Изменить адрес" : "Выбрать адрес"}</Text>
        </Pressable>
      </View>

      <View style={styles.mapContainer}>
        <MapBox
          initCenter={props.defaultCenter}
          active={{
            lng: props.address?.lng || props.defaultCenter.lng,
            lat: props.address?.lat || props.defaultCenter.lat,
          }}
          markers={filterAddress}
          onClickMarker={(lng, lat) => {
            checkoutAdapter.setActiveAddress(lng, lat);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    rowGap: 12,
  },
  activeMarker: {
    flexDirection: "row",
    columnGap: 4,
  },
  activeMarkerInfo: {
    flex: 1,
    rowGap: 4,
  },
  leftSideTitle: {
    fontWeight: "500",
    color: "#242424",
    fontSize: 16,
  },
  activeMarkerAddressText: {
    color: "#242424",
  },
  leftSideFooter: {
    alignItems: "flex-start",
  },
  button: {
    height: 36,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#a73afd",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  mapContainer: {
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
  },
});
