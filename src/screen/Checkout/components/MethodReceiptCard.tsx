import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { checkoutStore } from "../../../store/checkout/store";
import type { AddressItem } from "../../../store/checkout/types";
import { CheckoutAddress } from "./CheckoutAddress";
import { InfoCard } from "./InfoCard";
import { SelectMethodReceipt } from "./SelectMethodReceipt";

type Props = {
  pickupAddress: AddressItem[];
  defaultCenter: { lng: number; lat: number };
  navigation: NativeStackNavigationProp<ParamListBase, "Checkout">;
};

export const MethodReceiptCard = (props: Props) => {
  const method_receipt = checkoutStore((store) => store.method_receipt);

  return (
    <InfoCard title="Способ получения">
      <SelectMethodReceipt method_receipt={method_receipt} />
      <CheckoutAddress
        method_receipt={method_receipt}
        navigation={props.navigation}
        pickupAddress={props.pickupAddress}
        defaultCenter={props.defaultCenter}
      />
    </InfoCard>
  );
};
