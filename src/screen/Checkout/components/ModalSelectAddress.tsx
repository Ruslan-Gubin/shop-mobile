import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { getFullAddressItem } from "../../../shared/helpers/getFullAddressItem";
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
  const [selectPickup, setSelectPickup] = useState<{ lng: number; lat: number } | null>(null);

  useEffect(() => {
    if (props.active) {
      if (selectPickup === null && props.activePickup) {
        setSelectPickup(props.activePickup);
      }
    } else {
      setSelectPickup(null);
    }
  }, [props.active, props.activePickup, selectPickup]);

  const getIsActiveAddress = (lng: number, lat: number) => {
    if (selectPickup && lng === selectPickup.lng && lat === selectPickup.lat) {
      return true;
    }

    if (
      !selectPickup &&
      lng === props.defaultCenter.lng &&
      lat === props.defaultCenter.lat
    ) {
      return true;
    }

    return false;
  };

  const onSubmitPickup = () => {
    if (selectPickup) {
      checkoutAdapter.setActiveAddress(selectPickup.lng, selectPickup.lat);
    }
    props.onClose();
  };

  const isPickup = props.method_receipt === "pickup";
  const filterAddress = isPickup ? props.pickupAddress : props.courierAddress;

  return (
    <BaseModal
      visible={props.active}
      onClose={props.onClose}
      title="Способ доставки"
      footerAction={{
        cancel: {
          text: "Отмена",
          action: props.onClose,
          backgroundColor: "#f6f6f9",
        },
        submit: {
          text: isPickup ? "Заберу отсюда" : "Добавить адрес",
          action: isPickup ? onSubmitPickup : props.onAddAddress,
          disabled: isPickup && !selectPickup,
          backgroundColor: "#a73afd",
        },
      }}
    >
      {isPickup ? (
        <>
          <Text style={styles.hint}>Выберите склад самовывоза:</Text>
          <ScrollView style={styles.addressList}>
            {filterAddress.map((address) => {
              const isActive = getIsActiveAddress(address.lng, address.lat);

              return (
                <Pressable
                  key={`${address.lng}_${address.lat}_${address.type}_${address.name}`}
                  style={[styles.addressItem, isActive && styles.addressItemActive]}
                  onPress={() => setSelectPickup({ lng: address.lng, lat: address.lat })}
                >
                  <Text style={[styles.addressText, isActive && styles.addressTextActive]}>
                    {getFullAddressItem(address)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </>
      ) : (
        <Text style={styles.courierPlaceholder}>
          Добавление адреса курьера появится вместе с картой. Пока можно подтвердить адрес
          доставки вручную.
        </Text>
      )}
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  hint: {
    fontSize: 13,
    color: "#8a8999",
    marginBottom: 4,
  },
  addressList: {
    maxHeight: 380,
  },
  addressItem: {
    borderWidth: 1,
    borderColor: "#f1f1f5",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#25507e05",
    marginBottom: 8,
  },
  addressItemActive: {
    borderColor: "#ffcb54",
    backgroundColor: "#fff",
  },
  addressText: {
    fontSize: 14,
    color: "#868695",
  },
  addressTextActive: {
    color: "#242424",
  },
  courierPlaceholder: {
    fontSize: 14,
    lineHeight: 20,
    color: "#8a8999",
  },
});