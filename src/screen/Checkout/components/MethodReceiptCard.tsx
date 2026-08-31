import { checkoutStore } from "../../../store/checkout/store";
import type { AddressItem } from "../../../store/checkout/types";
import { CheckoutAddress } from "./CheckoutAddress";
import { InfoCard } from "./InfoCard";
import { SelectMethodReceipt } from "./SelectMethodReceipt";

type Props = {
  pickupAddress: AddressItem[];
  defaultCenter: { lng: number; lat: number };
};

export const MethodReceiptCard = ({ pickupAddress, defaultCenter }: Props) => {
  const method_receipt = checkoutStore((store) => store.method_receipt);

  return (
    <InfoCard title="Способ получения">
      <SelectMethodReceipt method_receipt={method_receipt} />
      <CheckoutAddress pickupAddress={pickupAddress} defaultCenter={defaultCenter} />
    </InfoCard>
  );
};

