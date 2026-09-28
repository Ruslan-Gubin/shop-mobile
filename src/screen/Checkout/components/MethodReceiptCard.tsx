import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AddressItem } from "../../../store/checkout/types";
import { CheckoutAddress } from "./CheckoutAddress";
import { InfoCard } from "./InfoCard";
import { SelectMethodReceipt } from "./SelectMethodReceipt";

type Props = {
  pickupAddress: AddressItem[];
  defaultCenter: { lng: number; lat: number };
  navigation: NativeStackNavigationProp<ParamListBase, "Checkout">;
  isDeliveryCourier: boolean;
  minOrderSum: number;
  method_receipt: "pickup" | "courier";
  selectModal: boolean;
  setSelectModal: (value: boolean) => void;
  address: AddressItem | null;
};

export const MethodReceiptCard = (props: Props) => {
  return (
    <InfoCard title="Способ получения">
      <SelectMethodReceipt
        method_receipt={props.method_receipt}
        isDeliveryCourier={props.isDeliveryCourier}
        minOrderSum={props.minOrderSum}
      />
      <CheckoutAddress
        address={props.address}
        isDeliveryCourier={props.isDeliveryCourier}
        selectModal={props.selectModal}
        setSelectModal={props.setSelectModal}
        minOrderSum={props.minOrderSum}
        method_receipt={props.method_receipt}
        navigation={props.navigation}
        pickupAddress={props.pickupAddress}
        defaultCenter={props.defaultCenter}
      />
    </InfoCard>
  );
};
