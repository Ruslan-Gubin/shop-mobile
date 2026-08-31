import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { getFullAddressItem } from "../../../shared/helpers/getFullAddressItem";
import { DeleteSvg } from "../../../shared/svg/DeleteSvg";
import { Checkbox } from "../../../shared/ui/checkbox/Checkbox";
import { SelectMethodReceiptModal } from "../../../shared/ui/SelectMethodReceiptModal/SelectMethodReceiptModal";
import { checkoutAdapter } from "../../../store/checkout/adapter";
import type { AddressItem } from "../../../store/checkout/types";
import { BaseModal } from "../../../widgets/modal/base-modal/BaseModal";

type Props = {
  active: boolean;
  onClose: () => void;
  onAddAddress: () => void;
  method_receipt: "pickup" | "courier";
  pickupAddress: AddressItem[];
  courierAddress: AddressItem[];
  defaultCenter: { lng: number; lat: number };
  activePickup: { lng: number; lat: number } | null;
  activeCourier: { lng: number; lat: number } | null;
};

export const ModalSelectAddress = (props: Props) => {
  const [methodReceipt, setMethodReceipt] = useState<"pickup" | "courier">("pickup");
  const [selectPickup, setSelectPickup] = useState<{ lng: number; lat: number } | null>(null);
  const [selectCourier, setSelectCourier] = useState<{ lng: number; lat: number } | null>(null);

  const handleChangeMethod = (value: "pickup" | "courier") => {
    setMethodReceipt(value);
  };

  const handleSelectAddress = (lng: number, lat: number) => {
    if (lng && lat) {
      if (methodReceipt === "pickup") {
        setSelectPickup({ lng, lat });
      } else if (methodReceipt === "courier") {
        setSelectCourier({ lng, lat });
      }
    }
  };

  const handleDeleteAddress = (lng: number, lat: number, name: string) => {
    if (lng && lat && name) {
      checkoutAdapter.deleteAddress(lng, lat, name);

      if (selectCourier?.lng === lng && selectCourier?.lat === lat) {
        if (props.activeCourier) {
          setSelectCourier(props.activeCourier);
        } else if (Array.isArray(props.courierAddress) && props.courierAddress[0]) {
          setSelectCourier({ lng: props.courierAddress[0].lng, lat: props.courierAddress[0].lat });
        }
      }
    }
  };

  const onSubmitAddress = () => {
    checkoutAdapter.setMethodReceipt(methodReceipt);
    if (methodReceipt === "pickup" && selectPickup) {
      checkoutAdapter.setActiveAddress(selectPickup.lng, selectPickup.lat);
    } else if (methodReceipt === "courier" && selectCourier) {
      checkoutAdapter.setActiveAddress(selectCourier.lng, selectCourier.lat);
    }
    props.onClose();
  };

  useEffect(() => {
    if (props.active) {
      if (selectPickup === null && props.activePickup) {
        setSelectPickup(props.activePickup);
      }

      if (selectCourier === null && props.activeCourier) {
        setSelectCourier(props.activeCourier);
      }
    } else {
      setSelectPickup(null);
      setSelectCourier(null);
    }
  }, [props.active, selectPickup, selectCourier, props.activeCourier, props.activePickup]);

  useEffect(() => {
    if (props.active) {
      setMethodReceipt(props.method_receipt);
    }
  }, [props.active, props.method_receipt]);

  const getIsActiveAddress = (lng: number, lat: number) => {
    let isActive = false;

    if (
      methodReceipt === "pickup" &&
      selectPickup &&
      lng === selectPickup.lng &&
      lat === selectPickup.lat
    ) {
      isActive = true;
    } else if (
      methodReceipt === "pickup" &&
      !selectPickup &&
      lng === props.defaultCenter.lng &&
      lat === props.defaultCenter.lat
    ) {
      isActive = true;
    } else if (
      methodReceipt === "courier" &&
      selectCourier &&
      lng === selectCourier.lng &&
      lat === selectCourier.lat
    ) {
      isActive = true;
    }

    return isActive;
  };

  const filterAddress = methodReceipt === "pickup" ? props.pickupAddress : props.courierAddress;

  return (
    <BaseModal
      visible={props.active}
      onClose={props.onClose}
      title="Способ доставки"
      footerAction={{
        cancel: {
          text: methodReceipt === "courier" ? "Добавить" : "Отмена",
          action: methodReceipt === "courier" ? props.onAddAddress : props.onClose,
          backgroundColor: methodReceipt === "courier" ? "#a73afd" : "#f6f6f9",
          color: methodReceipt === "courier" ? "white" : "gray",
        },
        submit: {
          text: methodReceipt === "courier" ? "Доставить сюда" : "Заберу отсюда",
          action: onSubmitAddress,
          disabled:
            (methodReceipt === "pickup" && !selectPickup) ||
            (methodReceipt === "courier" && !selectCourier),
          backgroundColor: "#a73afd",
        },
      }}
    >
      <View style={styles.selectTypeRoot}>
        <SelectMethodReceiptModal
          methodReceipt={methodReceipt}
          onChangeMethod={handleChangeMethod}
        />
      </View>

      <ScrollView style={styles.addressList}>
        {filterAddress.map((address) => (
          <View
            key={`${address.lng}_${address.lat}_${address.type}_${address.name}`}
            style={styles.addressItem}
          >
            <View style={{ flex: 1 }}>
              <Checkbox
                checked={getIsActiveAddress(address.lng, address.lat)}
                onPress={() => handleSelectAddress(address.lng, address.lat)}
                isRect
                label={getFullAddressItem(address)}
              />
            </View>
            {methodReceipt === "courier" &&
              !(props.activeCourier !== null &&
                props.activeCourier.lng === address.lng &&
                props.activeCourier.lat === address.lat) && (
                <Pressable
                  onPress={() => handleDeleteAddress(address.lng, address.lat, address.name)}
                  style={styles.deleteButton}
                >
                  <DeleteSvg fill="#a9a8b0" size={20} />
                </Pressable>
              )}
          </View>
        ))}
      </ScrollView>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  selectTypeRoot: {
    backgroundColor: "#fff",
  },
  addressList: {
    maxHeight: 350,
    minHeight: 350,
    flexGrow: 0,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 8,
    paddingVertical: 8,
  },
  deleteButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    height: 36,
    borderRadius: 12,
    backgroundColor: "#a73afd",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
