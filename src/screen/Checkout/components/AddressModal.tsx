import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { fetchReverseAction } from "../../../shared/helpers/geocode";
import { getActiveAddress } from "../../../shared/helpers/getActiveAddress";
import { getInitCenter } from "../../../shared/helpers/getInitCenter";
import { FieldInput } from "../../../shared/ui/FieldInput/FieldInput";
import { SelectMethodReceiptModal } from "../../../shared/ui/SelectMethodReceiptModal/SelectMethodReceiptModal";
import { checkoutAdapter } from "../../../store/checkout/adapter";
import type { AddressItem } from "../../../store/checkout/types";
import { BaseModal } from "../../../widgets/modal/base-modal/BaseModal";
import { AddressSearch } from "./address/AddressSearch";
import { MapBox } from "./map/MapBox";

type Props = {
  active: boolean;
  onClose: () => void;
  defaultCenter: { lng: number; lat: number };
  method_receipt: "pickup" | "courier";
  pickupAddress: AddressItem[];
  courierAddress: AddressItem[];
  activePickup: { lng: number; lat: number } | null;
  activeCourier: { lng: number; lat: number } | null;
};

export const AddressModal = (props: Props) => {
  const [methodReceipt, setMethodReceipt] = useState<"pickup" | "courier">("courier");
  const [selectPickup, setSelectPickup] = useState<{ lng: number; lat: number } | null>(null);
  const [selectCourier, setSelectCourier] = useState<AddressItem | null>(null);

  const initCenter = getInitCenter(
    props.defaultCenter,
    props.pickupAddress,
    props.courierAddress,
    props.activePickup,
    props.activeCourier,
    props.method_receipt,
  );

  useEffect(() => {
    if (props.active) {
      if (selectPickup === null && props.activePickup) {
        setSelectPickup(props.activePickup);
      }
    } else {
      setSelectPickup(null);
      setSelectCourier(null);
      setMethodReceipt("courier");
    }
  }, [props.active, selectPickup, props.activePickup]);

  const handleChangeMethod = (value: "pickup" | "courier") => {
    setMethodReceipt(value);
  };

  const handleSelectAddress = (lng: number, lat: number) => {
    if (methodReceipt === "pickup" && lng && lat) {
      setSelectPickup({ lng, lat });
    }
  };

  const getIsActiveAddress = (lng: number, lat: number) => {
    if (
      methodReceipt === "pickup" &&
      selectPickup &&
      lng === selectPickup.lng &&
      lat === selectPickup.lat
    ) {
      return true;
    }

    if (
      methodReceipt === "pickup" &&
      !selectPickup &&
      lng === props.defaultCenter.lng &&
      lat === props.defaultCenter.lat
    ) {
      return true;
    }

    if (
      methodReceipt === "courier" &&
      selectCourier &&
      lng === selectCourier.lng &&
      lat === selectCourier.lat
    ) {
      return true;
    }

    return false;
  };

  const handleClickMap = (lng: number, lat: number) => {
    if (methodReceipt === "courier" && lng && lat) {
      fetchReverseAction(lng, lat)
        .then((response) => {
          setSelectCourier({
            ...response,
            entrance: "",
            flat: "",
            floor: "",
            intercom: "",
            type: "courier",
          });
        })
        .catch(() => undefined);
    }
  };

  const handleClickMarker = (lng: number, lat: number) => {
    if (methodReceipt === "pickup" && lng && lat) {
      setSelectPickup({ lng, lat });
    } else if (methodReceipt === "courier" && selectCourier) {
      setSelectCourier((prev) => (prev ? { ...prev, lng, lat } : null));
    }
  };

  const activeAddress = getActiveAddress(
    props.pickupAddress,
    props.courierAddress,
    initCenter,
    methodReceipt,
    selectPickup,
    selectCourier ?? props.activeCourier,
  );

  const handleSubmitModal = () => {
    checkoutAdapter.setMethodReceipt(methodReceipt);

    if (methodReceipt === "pickup" && selectPickup) {
      checkoutAdapter.setActiveAddress(selectPickup.lng, selectPickup.lat);
    } else if (methodReceipt === "courier" && selectCourier) {
      checkoutAdapter.addAddress(selectCourier);
      checkoutAdapter.setActiveAddress(selectCourier.lng, selectCourier.lat);
      setSelectCourier(null);
    }

    props.onClose();
  };

  const isSubmitDisabled =
    (methodReceipt === "pickup" && !selectPickup) ||
    (methodReceipt === "courier" && !selectCourier);

  const handleChangeValues = (
    value: string,
    key: keyof Omit<AddressItem, "type" | "lng" | "lat" | "name" | "place">,
  ) => {
    setSelectCourier((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  return (
    <BaseModal
      visible={props.active}
      onClose={props.onClose}
      title={
        methodReceipt === "courier" && selectCourier?.name ? selectCourier.name : "Способ доставки"
      }
      footerAction={{
        cancel: {
          text: "Отмена",
          action: props.onClose,
          backgroundColor: "#f6f6f9",
        },
        submit: {
          text: methodReceipt === "courier" ? "Доставить сюда" : "Заберу отсюда",
          action: handleSubmitModal,
          disabled: isSubmitDisabled,
          backgroundColor: "#a73afd",
        },
      }}
    >
      <SelectMethodReceiptModal methodReceipt={methodReceipt} onChangeMethod={handleChangeMethod} />

      <View style={styles.mapContainer}>
        {activeAddress && props.active && (
          <MapBox
            onClickMap={handleClickMap}
            onClickMarker={handleClickMarker}
            active={activeAddress}
            initCenter={activeAddress}
            markers={
              methodReceipt === "pickup"
                ? props.pickupAddress
                : selectCourier
                  ? [selectCourier]
                  : []
            }
            initZoom={15}
          />
        )}
      </View>

      <ScrollView style={styles.formContent} showsVerticalScrollIndicator={false}>
        {methodReceipt === "courier" && (
          <View style={styles.searchSection}>
            <AddressSearch
              onSelectCourier={(payload) =>
                setSelectCourier({
                  ...payload,
                  entrance: "",
                  flat: "",
                  floor: "",
                  intercom: "",
                  type: "courier",
                })
              }
            />
            {!selectCourier && (
              <>
                <Text style={styles.subTitle}>Куда доставить заказ?</Text>
                <Text style={styles.inputLabel}>Укажите адрес на карте или используйте поиск</Text>
              </>
            )}
          </View>
        )}

        {methodReceipt === "courier" && selectCourier && (
          <View style={styles.formInputs}>
            <View style={styles.formInputsLine}>
              <View style={styles.formInputsItem}>
                <Text style={styles.inputLabel}>Квартира</Text>
                <FieldInput
                  value={selectCourier.flat}
                  onChangeText={(value) => handleChangeValues(value, "flat")}
                  placeholder="Номер"
                  maxLength={10}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.formInputsItem}>
                <Text style={styles.inputLabel}>Подъезд</Text>
                <FieldInput
                  value={selectCourier.entrance}
                  onChangeText={(value) => handleChangeValues(value, "entrance")}
                  placeholder="Номер"
                  maxLength={20}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <View style={styles.formInputsLine}>
              <View style={styles.formInputsItem}>
                <Text style={styles.inputLabel}>Домофон</Text>
                <FieldInput
                  value={selectCourier.intercom}
                  onChangeText={(value) => handleChangeValues(value, "intercom")}
                  placeholder="Номер"
                  maxLength={20}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.formInputsItem}>
                <Text style={styles.inputLabel}>Этаж</Text>
                <FieldInput
                  value={selectCourier.floor}
                  onChangeText={(value) => handleChangeValues(value, "floor")}
                  placeholder="Номер"
                  maxLength={10}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>
        )}

        {methodReceipt === "pickup" && (
          <View style={styles.pickupList}>
            {props.pickupAddress.map((marker) => {
              const isActive = getIsActiveAddress(marker.lng, marker.lat);

              return (
                <Pressable
                  key={`${marker.lng}_${marker.lat}_${marker.type}_${marker.name}`}
                  style={[styles.pickupItem, isActive && styles.pickupItemActive]}
                  onPress={() => handleSelectAddress(marker.lng, marker.lat)}
                >
                  <Text style={[styles.pickupItemTitle, isActive && styles.pickupItemTitleActive]}>
                    {marker.name}
                  </Text>
                  <Text style={styles.pickupItemSubTitle}>Пункт выдачи бесплатно</Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: 240,
    borderRadius: 12,
    overflow: "hidden",
  },
  formContent: {
    maxHeight: 320,
    flexGrow: 0,
  },
  searchSection: {
    rowGap: 4,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#242424",
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 12,
    color: "#8a8999",
  },
  formInputs: {
    rowGap: 12,
    marginTop: 4,
  },
  formInputsLine: {
    flexDirection: "row",
    columnGap: 8,
  },
  formInputsItem: {
    flex: 1,
    rowGap: 4,
  },
  pickupList: {
    rowGap: 8,
    marginTop: 4,
  },
  pickupItem: {
    borderWidth: 1,
    borderColor: "#f1f1f5",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#25507e05",
    rowGap: 2,
  },
  pickupItemActive: {
    borderColor: "#ffcb54",
    backgroundColor: "#fff",
  },
  pickupItemTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#868695",
  },
  pickupItemTitleActive: {
    color: "#242424",
  },
  pickupItemSubTitle: {
    fontSize: 12,
    color: "#8a8999",
  },
});

