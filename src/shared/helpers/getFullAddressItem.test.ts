import type { AddressItem } from "../../store/checkout/types";
import { getFullAddressItem } from "./getFullAddressItem";

const address: AddressItem = {
  type: "pickup",
  name: "Клочкова улица 4",
  place: "",
  lng: 37.8,
  lat: 48.01,
  entrance: "",
  flat: "",
  floor: "",
  intercom: "",
};

describe("getFullAddressItem", () => {
  it("возвращает только name, если остальные поля пустые", () => {
    expect(getFullAddressItem(address)).toBe("Клочкова улица 4");
  });

  it("добавляет квартиру", () => {
    expect(getFullAddressItem({ ...address, flat: "25" })).toBe("Клочкова улица 4, кв. 25");
  });

  it("добавляет кв., домофон и этаж в правильном порядке", () => {
    expect(getFullAddressItem({ ...address, flat: "25", intercom: "7", floor: "3" })).toBe(
      "Клочкова улица 4, кв. 25, дмф. 7, этаж 3",
    );
  });

  it("возвращает пустую строку при пустом name", () => {
    expect(getFullAddressItem({ ...address, name: "" })).toBe("");
  });
});