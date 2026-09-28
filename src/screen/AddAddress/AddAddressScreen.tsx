import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { FeatureCollection, Polygon, Position } from "geojson";
import { useEffect, useEffectEvent, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CONFIG_APP } from "../../shared/config/config";
import { fetchService } from "../../shared/fetch-api";
import { findMapSector } from "../../shared/helpers/findMapSector";
import { formatterRub } from "../../shared/helpers/formatters";
import { fetchReverseAction, type GeocodeResult } from "../../shared/helpers/geocode";
import { getMessageError } from "../../shared/helpers/getMessageError";
import { ArrowBackIcon } from "../../shared/svg/ArrowBackIcon";
import { PinAddressSvg } from "../../shared/svg/PinAddressSvg";
import type { SectorModel } from "../../shared/types/sectors";
import { FieldInput } from "../../shared/ui/FieldInput/FieldInput";
import { checkoutAdapter } from "../../store/checkout/adapter";
import { checkoutStore } from "../../store/checkout/store";
import type { AddressItem } from "../../store/checkout/types";
import { MapBox } from "../Checkout/components/map/MapBox";
import { AddressSearchModal } from "./components/AddressSearchModal";

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase, "AddAddress">;
};

export const AddAddressScreen = (props: Props) => {
  const [address, setAddress] = useState<AddressItem | null>(null);
  const [searchModal, setSearchModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const courierAddress = checkoutStore((store) => store.courierAddress);
  const activeCourier = checkoutStore((store) => store.activeCourier);
  const [zones, setZones] = useState<
    FeatureCollection<Polygon, { id: number; color: string; price: number }>
  >({ type: "FeatureCollection", features: [] });
  const [isOutOfZone, setIsOutOfZone] = useState<boolean>(false);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);

  const fetchDeliverySectors = useEffectEvent(() => {
    fetchService
      .get<SectorModel[]>({ url: "sectors/delivery" })
      .then((response) => {
        if (response.status === "success" && Array.isArray(response.data)) {
          setZones({
            type: "FeatureCollection",
            features: response.data.map((sector) => ({
              type: "Feature",
              properties: { id: sector.id, color: sector.color, price: sector.price },
              geometry: { type: "Polygon", coordinates: [sector.coordinates as Position[]] },
            })),
          });
        } else if (response.status === "error") {
          throw response.message;
        }
      })
      .catch((error) => {
        const message = getMessageError(error, "Не удалось получить список секторов для доставки");

        Alert.alert("Ошибка", message, [
          { text: "Отмена", style: "default" },
          {
            text: "Повторить",
            isPreferred: true,
            onPress: fetchDeliverySectors,
          },
        ]);
      });
  });

  useEffect(() => {
    fetchDeliverySectors();
  }, []);

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
        const zone = findMapSector(zones.features, lng, lat);

        setIsOutOfZone(zone === null);
        setDeliveryPrice(zone?.properties?.price || 0);
      })
      .catch(() => undefined);
  };

  const handleSelectFromSearch = (payload: GeocodeResult) => {
    const zone = findMapSector(zones.features, payload.lng, payload.lat);
    setIsOutOfZone(zone === null);
    setDeliveryPrice(zone?.properties?.price || 0);

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

  const isValidAddress = address?.lng && address.lat;

  const handleSubmit = () => {
    if (isValidAddress) {
      checkoutAdapter.addAddress(address);
      checkoutAdapter.setActiveAddress(address.lng, address.lat);
      props?.navigation?.reset({ index: 0, routes: [{ name: "Checkout" }] });
    }
  };

  const hasActiveAddress = courierAddress.length > 0 && activeCourier !== null;
  const initCenter = address
    ? { lng: address.lng, lat: address.lat }
    : hasActiveAddress
      ? { lng: activeCourier.lng, lat: activeCourier.lat }
      : {
          lng: CONFIG_APP.DEFAULT_MAP_CENTER_LNG,
          lat: CONFIG_APP.DEFAULT_MAP_CENTER_LAT,
        };

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
          zones={zones}
          initCenter={initCenter}
          active={address}
          markers={address ? [address] : []}
          onClickMap={handleClickMap}
          onClickMarker={(lng, lat) => handleClickMap(lng, lat)}
          initZoom={address || hasActiveAddress ? 17 : 14}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Назад"
          hitSlop={8}
          onPress={() => props?.navigation?.goBack()}
          style={styles.backButton}
        >
          <ArrowBackIcon fill="#242424" size={28} />
        </Pressable>
        {isValidAddress && !isOutOfZone && (
          <View style={styles.deliveryPrice}>
            {deliveryPrice > 0 ? (
              <>
                <Text>Доставка</Text>
                <Text style={styles.deliveryPriceValue}>{formatterRub.format(deliveryPrice)}</Text>
              </>
            ) : (
              <Text style={styles.deliveryPriceFree}>Бесплатно</Text>
            )}
          </View>
        )}
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {(!isValidAddress || isOutOfZone) && (
          <View style={styles.noAddressBlock}>
            {isOutOfZone && (
              <Text style={styles.outOfZoneText}>По этому адресу доставка не осуществляется.</Text>
            )}
            <Pressable style={styles.searchButton} onPress={handleOpenSearch}>
              <PinAddressSvg size={20} fill="#8a8999" />
              <Text style={styles.searchButtonText}>Укажите адрес на карте или найдите</Text>
            </Pressable>

            <Pressable style={styles.submitButtonDisabled} disabled>
              <Text style={styles.submitButtonTextDisabled}>Продолжить</Text>
            </Pressable>
          </View>
        )}

        {isValidAddress && !isOutOfZone && (
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
                  <FieldInput
                    label="Квартира"
                    value={address.flat}
                    onChangeText={(value) => handleChangeValues(value, "flat")}
                    placeholder="Номер"
                    maxLength={10}
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.formInputsItem}>
                  <FieldInput
                    label="Подъезд"
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
                  <FieldInput
                    label="Домофон"
                    value={address.intercom}
                    onChangeText={(value) => handleChangeValues(value, "intercom")}
                    placeholder="Номер"
                    maxLength={20}
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.formInputsItem}>
                  <FieldInput
                    label="Этаж"
                    value={address.floor}
                    onChangeText={(value) => handleChangeValues(value, "floor")}
                    placeholder="Номер"
                    maxLength={10}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>

            <Pressable
              style={[styles.submitButton]}
              disabled={!isValidAddress || isOutOfZone}
              onPress={handleSubmit}
            >
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
  outOfZoneText: {
    color: "#cd5c5c",
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
  deliveryPrice: {
    position: "absolute",
    top: 12,
    right: 12,
    maxWidth: "70%",
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    paddingHorizontal: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  deliveryPriceValue: {
    fontWeight: "600",
    color: "#242424",
  },
  deliveryPriceFree: {
    fontWeight: "500",
    color: "#22c55e",
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
