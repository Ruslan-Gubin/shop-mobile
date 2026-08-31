import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getActiveAddress } from "../../../shared/helpers/getActiveAddress";
import { getFullAddressItem } from "../../../shared/helpers/getFullAddressItem";
import { PinAddressSvg } from "../../../shared/svg/PinAddressSvg";
import { checkoutAdapter } from "../../../store/checkout/adapter";
import { checkoutStore } from "../../../store/checkout/store";
import type { AddressItem } from "../../../store/checkout/types";
import { AddressModal } from "./AddressModal";
import { ModalSelectAddress } from "./ModalSelectAddress";
import { MapBox } from "./map/MapBox";

type Props = {
  pickupAddress: AddressItem[];
  defaultCenter: { lng: number; lat: number };
};

export const CheckoutAddress = ({ pickupAddress, defaultCenter }: Props) => {
  const method_receipt = checkoutStore((store) => store.method_receipt);
  const activePickup = checkoutStore((store) => store.activePickup);
  const activeCourier = checkoutStore((store) => store.activeCourier);
  const courierAddress = checkoutStore((store) => store.courierAddress);

  const [selectModal, setSelectModal] = useState(false);
  const [selectAddressModal, setSelectAddressModal] = useState(false);

  const activeAddress = getActiveAddress(
    pickupAddress,
    courierAddress,
    defaultCenter,
    method_receipt,
    activePickup,
    activeCourier,
  );

  const filterAddress = method_receipt === "pickup" ? pickupAddress : courierAddress;

  const selectAddress = activeAddress
    ? (filterAddress.find((el) => el.lng === activeAddress.lng && el.lat === activeAddress.lat) ??
      null)
    : null;

  const handleClickAddAddress = () => {
    setSelectModal(false);
    setSelectAddressModal(true);
  };

  const hasActive =
    (method_receipt === "courier" && activeCourier) ||
    (method_receipt === "pickup" && activePickup);

  return (
    <View style={styles.root}>
      <ModalSelectAddress
        active={selectModal}
        onClose={() => setSelectModal(false)}
        onAddAddress={handleClickAddAddress}
        method_receipt={method_receipt}
        pickupAddress={pickupAddress}
        courierAddress={courierAddress}
        defaultCenter={defaultCenter}
        activePickup={activePickup}
        activeCourier={activeCourier}
      />
      <AddressModal
        active={selectAddressModal}
        onClose={() => setSelectAddressModal(false)}
        defaultCenter={defaultCenter}
        method_receipt={method_receipt}
        pickupAddress={pickupAddress}
        courierAddress={courierAddress}
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
            <Text style={styles.activeMarkerAddressText}>
              Минимальная сумма заказа {method_receipt === "courier" ? 5000 : 0} ₽.
            </Text>
            <Text style={styles.activeMarkerAddressText}>
              Способ оплаты: наличными или оплата картой по терминалу.
            </Text>
          </View>
        </View>
      )}

      <View style={styles.leftSideFooter}>
        <Pressable style={styles.button} onPress={() => setSelectModal(true)}>
          <Text style={styles.buttonText}>{hasActive ? "Изменить адрес" : "Выбрать адрес"}</Text>
        </Pressable>
      </View>

      <View style={styles.mapContainer}>
        <MapBox
          initCenter={defaultCenter}
          active={activeAddress}
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

