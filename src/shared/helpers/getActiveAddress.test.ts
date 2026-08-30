import type { AddressItem } from "../../store/checkout/types";
import { getActiveAddress } from "./getActiveAddress";

const initCenter = { lng: 37.80358599891716, lat: 48.013597598505555 };

const pickupAddress: AddressItem[] = [
  {
    type: "pickup",
    name: "Клочкова улица 4",
    place: "",
    lng: 37.80358599891716,
    lat: 48.013597598505555,
    entrance: "",
    flat: "",
    floor: "",
    intercom: "",
  },
  {
    type: "pickup",
    name: "Университетская 21",
    place: "",
    lng: 37.9,
    lat: 48.02,
    entrance: "",
    flat: "",
    floor: "",
    intercom: "",
  },
];

const courierAddress: AddressItem[] = [
  {
    type: "courier",
    name: "Пушкинская 12",
    place: "",
    lng: 37.1,
    lat: 48.1,
    entrance: "",
    flat: "5",
    floor: "",
    intercom: "",
  },
];

describe("getActiveAddress", () => {
  it("для самовывоза возвращает activePickup, если он задан", () => {
    const result = getActiveAddress(pickupAddress, courierAddress, initCenter, "pickup", {
      lng: 37.9,
      lat: 48.02,
    }, null);

    expect(result).toEqual({ lng: 37.9, lat: 48.02 });
  });

  it("для самовывоза без activePickup берёт склад по defaultCenter", () => {
    const result = getActiveAddress(pickupAddress, courierAddress, initCenter, "pickup", null, null);

    expect(result).toEqual(initCenter);
  });

  it("для самовывоза без activePickup и без склада в списке возвращает initCenter", () => {
    const result = getActiveAddress(
      [pickupAddress[1] as AddressItem],
      courierAddress,
      initCenter,
      "pickup",
      null,
      null,
    );

    expect(result).toEqual(initCenter);
  });

  it("для курьера возвращает activeCourier, если он задан", () => {
    const result = getActiveAddress(pickupAddress, courierAddress, initCenter, "courier", null, {
      lng: 37.1,
      lat: 48.1,
    });

    expect(result).toEqual({ lng: 37.1, lat: 48.1 });
  });

  it("для курьера без activeCourier берёт первый адрес из courierAddress", () => {
    const result = getActiveAddress(
      pickupAddress,
      courierAddress,
      initCenter,
      "courier",
      null,
      {
        lng: undefined as unknown as number,
        lat: undefined as unknown as number,
      },
    );

    expect(result).toEqual({ lng: 37.1, lat: 48.1 });
  });

  it("для курьера без адресов возвращает initCenter", () => {
    const result = getActiveAddress(pickupAddress, [], initCenter, "courier", null, null);

    expect(result).toEqual(initCenter);
  });
});