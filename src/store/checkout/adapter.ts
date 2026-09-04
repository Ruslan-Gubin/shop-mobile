import { checkoutStore } from "./store";
import type { AddressItem } from "./types";

export class CheckoutAdapter {
  private store = checkoutStore;

  public changePaymentMethod(payment_method: "cash" | "card") {
    this.store.setState({ payment_method });
  }

  public setDeliveryDate(delivery_date: string) {
    this.store.setState({ delivery_date });
  }

  public setDeliveryTime(value: number) {
    const prevValue = this.store.getState().delivery_time;

    this.store.setState({ delivery_time: prevValue && prevValue === value ? 0 : value });
  }

  public setMethodReceipt(method_receipt: "pickup" | "courier") {
    this.store.setState({ method_receipt });
  }

  public setActiveAddress(lng: number, lat: number) {
    const method_receipt = this.store.getState().method_receipt;

    if (method_receipt === "courier") {
      this.store.setState({ activeCourier: { lng, lat } });
    } else if (method_receipt === "pickup") {
      this.store.setState({ activePickup: { lng, lat } });
    }
  }

  public addAddress(address: AddressItem) {
    const courierAddress = this.store.getState().courierAddress;

    if (!courierAddress.some((el) => el.lat === address.lat && el.lng === address.lng)) {
      this.store.setState({ courierAddress: [address, ...courierAddress] });
    }
  }

  public deleteAddress(lng: number, lat: number, name: string) {
    const courierAddress = this.store.getState().courierAddress;

    this.store.setState({
      courierAddress: courierAddress.filter(
        (el) => el.lng !== lng && el.lat !== lat && el.name !== name,
      ),
    });
  }

  public changeAdditionalInfoInputs(value: string, key: "recipient_name" | "phone" | "comment") {
    if (key === "recipient_name") {
      this.store.setState({ recipient_name: value, recipient_name_error: "" });
    } else if (key === "phone") {
      this.store.setState({ phone: value, phone_error: "" });
    } else if (key === "comment") {
      this.store.setState({ comment: value, comment_error: "" });
    }
  }

  public activeErrorAdditionalInfoInputs(
    value: string,
    key: "recipient_name_error" | "phone_error" | "comment_error",
  ) {
    if (key === "recipient_name_error") {
      this.store.setState({ recipient_name_error: value });
    } else if (key === "phone_error") {
      this.store.setState({ phone_error: value });
    } else if (key === "comment_error") {
      this.store.setState({ comment_error: value });
    }
  }
}

export const checkoutAdapter = new CheckoutAdapter();
