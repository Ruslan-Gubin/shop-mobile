jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    getAllKeys: jest.fn(),
    multiGet: jest.fn(),
    multiSet: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

import { checkoutAdapter } from "./adapter";
import { checkoutStore } from "./store";
import type { AddressItem } from "./types";

const resetStore = () => {
  checkoutStore.setState({
    payment_method: "cash",
    delivery_date: "",
    delivery_time: 0,
    method_receipt: "pickup",
    activePickup: null,
    activeCourier: null,
    courierAddress: [],
    comment: "",
    phone: "",
    recipient_name: "",
    comment_error: "",
    phone_error: "",
    recipient_name_error: "",
  });
};

const address: AddressItem = {
  type: "courier",
  name: "ул. Пушкина, 1",
  place: "Донецк",
  lng: 37.8,
  lat: 48.0,
  entrance: "",
  flat: "",
  floor: "",
  intercom: "",
};

describe("CheckoutAdapter", () => {
  beforeEach(resetStore);

  it("changes payment method", () => {
    checkoutAdapter.changePaymentMethod("card");
    expect(checkoutStore.getState().payment_method).toBe("card");
  });

  it("sets delivery date", () => {
    checkoutAdapter.setDeliveryDate("Tue Aug 31 2026");
    expect(checkoutStore.getState().delivery_date).toBe("Tue Aug 31 2026");
  });

  it("toggles delivery time on repeated click", () => {
    checkoutAdapter.setDeliveryTime(12);
    expect(checkoutStore.getState().delivery_time).toBe(12);

    checkoutAdapter.setDeliveryTime(12);
    expect(checkoutStore.getState().delivery_time).toBe(0);
  });

  it("sets another delivery time", () => {
    checkoutAdapter.setDeliveryTime(12);
    checkoutAdapter.setDeliveryTime(14);
    expect(checkoutStore.getState().delivery_time).toBe(14);
  });

  it("sets active address depending on method receipt", () => {
    checkoutAdapter.setActiveAddress(37.8, 48.0);
    expect(checkoutStore.getState().activePickup).toEqual({ lng: 37.8, lat: 48.0 });
    expect(checkoutStore.getState().activeCourier).toBeNull();

    checkoutAdapter.setMethodReceipt("courier");
    checkoutAdapter.setActiveAddress(37.9, 48.1);
    expect(checkoutStore.getState().activeCourier).toEqual({ lng: 37.9, lat: 48.1 });
    expect(checkoutStore.getState().activePickup).toEqual({ lng: 37.8, lat: 48.0 });
  });

  it("adds address to the top of the list", () => {
    checkoutAdapter.addAddress(address);
    expect(checkoutStore.getState().courierAddress[0]).toEqual(address);
  });

  it("deletes address by lng, lat and name", () => {
    checkoutAdapter.addAddress(address);
    checkoutAdapter.deleteAddress(37.8, 48.0, "ул. Пушкина, 1");
    expect(checkoutStore.getState().courierAddress).toEqual([]);
  });

  it("changes recipient name and clears its error", () => {
    checkoutAdapter.activeErrorAdditionalInfoInputs("Ошибка", "recipient_name_error");
    checkoutAdapter.changeAdditionalInfoInputs("Иван", "recipient_name");
    expect(checkoutStore.getState().recipient_name).toBe("Иван");
    expect(checkoutStore.getState().recipient_name_error).toBe("");
  });

  it("changes phone and clears its error", () => {
    checkoutAdapter.activeErrorAdditionalInfoInputs("Ошибка", "phone_error");
    checkoutAdapter.changeAdditionalInfoInputs("79111111111", "phone");
    expect(checkoutStore.getState().phone).toBe("79111111111");
    expect(checkoutStore.getState().phone_error).toBe("");
  });

  it("changes comment and clears its error", () => {
    checkoutAdapter.activeErrorAdditionalInfoInputs("Ошибка", "comment_error");
    checkoutAdapter.changeAdditionalInfoInputs("Без лука", "comment");
    expect(checkoutStore.getState().comment).toBe("Без лука");
    expect(checkoutStore.getState().comment_error).toBe("");
  });

  it("activates error for additional info inputs", () => {
    checkoutAdapter.activeErrorAdditionalInfoInputs("Некорректный номер", "phone_error");
    expect(checkoutStore.getState().phone_error).toBe("Некорректный номер");
  });
});