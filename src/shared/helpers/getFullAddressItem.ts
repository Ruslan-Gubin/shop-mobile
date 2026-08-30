import type { AddressItem } from "../../store/checkout/types";

export const getFullAddressItem = (address: AddressItem) => {
  let result = "";

  if (address.name) {
    result += address.name;

    if (address.flat) {
      result += `, кв. ${address.flat}`;
    }

    if (address.intercom) {
      result += `, дмф. ${address.intercom}`;
    }

    if (address.floor) {
      result += `, этаж ${address.floor}`;
    }
  }

  return result;
};