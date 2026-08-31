import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { fetchReverseAction, type GeocodeResult } from "../../shared/helpers/geocode";
import { ArrowBackIcon } from "../../shared/svg/ArrowBackIcon";
import { PinAddressSvg } from "../../shared/svg/PinAddressSvg";
import { FieldInput } from "../../shared/ui/FieldInput/FieldInput";
import { checkoutAdapter } from "../../store/checkout/adapter";
import { checkoutStore } from "../../store/checkout/store";
import type { AddressItem } from "../../store/checkout/types";
import { MapBox } from "../Checkout/components/map/MapBox";
import { AddressSearchModal } from "./components/AddressSearchModal";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "AddAddress">;
  route?: {
    key: string;
    name: string;
    params?: {
      addressName?: string;
      addressPlace?: string;
      lng?: number;
      lat?: number;
    };
  };
};

const DEFAULT_CENTER = { lng: 37.80358599891716, lat: 48.013597598505555 };

export const AddAddressScreen = ({ navigation }: Props) => {
  const [address, setAddress] = useState<AddressItem | null>(null);
  const [searchModal, setSearchModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const courierAddress = checkoutStore((store) => store.courierAddress);
  const activeCourier = checkoutStore((store) => store.activeCourier);

  const handleClickMap = (lng: number, lat: number) => {
    fetchReverseAction(lng, lat)
      .then((response) => {
        setAddress({
          ...response,
          entrance: "",
          flat: "",
          floor: "",
          intercom: "",
          type: "courier",
        });
      })
      .catch(() => undefined);
  };

  const handleSelectFromSearch = (payload: GeocodeResult) => {
    setAddress({
      ...payload,
      entrance: "",
      flat: "",
      floor: "",
      intercom: "",
      type: "courier",
    });
  };

  const handleChangeValues = (
    value: string,
    key: keyof Omit<AddressItem, "type" | "lng" | "lat" | "name" | "place">,
  ) => {
    setAddress((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const handleOpenSearch = () => {
    setSearchText(address ? `${address.place}, ${address.name}` : "");
    setSearchModal(true);
  };

  const handleSubmit = () => {
    if (!address) return;

    checkoutAdapter.addAddress(address);
    checkoutAdapter.setActiveAddress(address.lng, address.lat);
    navigation.goBack();
  };

  const hasActiveAddress = courierAddress.length > 0 && activeCourier !== null;
  const initCenter = address
    ? { lng: address.lng, lat: address.lat }
    : hasActiveAddress
      ? { lng: activeCourier.lng, lat: activeCourier.lat }
      : DEFAULT_CENTER;
  const initZoom = address || hasActiveAddress ? 15 : 11;

  return (
    <View style={styles.root}>
      <AddressSearchModal
        visible={searchModal}
        onClose={() => {
          setSearchText("");
          setSearchModal(false);
        }}
        onSelect={handleSelectFromSearch}
        search={searchText}
        onChangeSearch={setSearchText}
      />
      <View style={styles.mapContainer}>
        <MapBox
          initCenter={initCenter}
          active={address}
          markers={address ? [address] : []}
          onClickMap={handleClickMap}
          onClickMarker={(lng, lat) => handleClickMap(lng, lat)}
          initZoom={initZoom}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Назад"
          hitSlop={8}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowBackIcon fill="#242424" size={28} />
        </Pressable>
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {!address && (
          <View style={styles.noAddressBlock}>
            <Pressable style={styles.searchButton} onPress={handleOpenSearch}>
              <PinAddressSvg size={20} fill="#8a8999" />
              <Text style={styles.searchButtonText}>Укажите адрес на карте или найдите</Text>
            </Pressable>
            <Pressable style={styles.submitButtonDisabled} disabled>
              <Text style={styles.submitButtonTextDisabled}>Продолжить</Text>
            </Pressable>
          </View>
        )}

        {address && (
          <View style={styles.addressBlock}>
            <Pressable
              style={styles.addressInfo}
              onPress={handleOpenSearch}
              accessibilityRole="button"
              accessibilityLabel="Изменить адрес"
            >
              <PinAddressSvg size={24} />
              <View style={styles.addressInfoText}>
                <Text style={styles.addressName}>{address.name}</Text>
                <Text style={styles.addressPlace}>{address.place}</Text>
              </View>
            </Pressable>

            <View style={styles.formInputs}>
              <View style={styles.formInputsLine}>
                <View style={styles.formInputsItem}>
                  <Text style={styles.inputLabel}>Квартира</Text>
                  <FieldInput
                    value={address.flat}
                    onChangeText={(value) => handleChangeValues(value, "flat")}
                    placeholder="Номер"
                    maxLength={10}
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.formInputsItem}>
                  <Text style={styles.inputLabel}>Подъезд</Text>
                  <FieldInput
                    value={address.entrance}
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
                    value={address.intercom}
                    onChangeText={(value) => handleChangeValues(value, "intercom")}
                    placeholder="Номер"
                    maxLength={20}
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.formInputsItem}>
                  <Text style={styles.inputLabel}>Этаж</Text>
                  <FieldInput
                    value={address.floor}
                    onChangeText={(value) => handleChangeValues(value, "floor")}
                    placeholder="Номер"
                    maxLength={10}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>

            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Продолжить</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mapContainer: {
    flex: 1,
    minHeight: 300,
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  formContainer: {
    maxHeight: 350,
    flexGrow: 0,
    padding: 16,
    paddingBottom: 32,
    rowGap: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  noAddressBlock: {
    rowGap: 12,
  },
  searchButton: {
    height: 36,
    borderWidth: 1,
    borderColor: "#cecece",
    borderRadius: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    paddingHorizontal: 12,
  },
  searchButtonText: {
    fontSize: 15,
    color: "#8a8999",
  },
  submitButtonDisabled: {
    height: 36,
    borderRadius: 12,
    backgroundColor: "#a73afd",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.4,
  },
  submitButtonTextDisabled: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  addressBlock: {
    rowGap: 16,
  },
  addressInfo: {
    flexDirection: "row",
    columnGap: 8,
    paddingVertical: 4,
  },
  addressInfoText: {
    flex: 1,
    rowGap: 2,
  },
  addressName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#242424",
  },
  addressPlace: {
    fontSize: 14,
    color: "#8a8999",
  },
  formInputs: {
    rowGap: 12,
  },
  formInputsLine: {
    flexDirection: "row",
    columnGap: 8,
  },
  formInputsItem: {
    flex: 1,
    rowGap: 4,
  },
  inputLabel: {
    fontSize: 12,
    color: "#8a8999",
  },
  submitButton: {
    height: 36,
    borderRadius: 12,
    backgroundColor: "#a73afd",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
