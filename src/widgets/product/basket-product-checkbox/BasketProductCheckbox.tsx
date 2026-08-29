import { Checkbox } from "../../../shared/ui/checkbox/Checkbox";
import { basketAdapter } from "../../../store/basket/adapter";
import { basketStore } from "../../../store/basket/store";

type Props = {
  id: number;
};

export const BasketProductCheckbox = (props: Props) => {
  const selected = basketStore((store) => store.selected);

  const handleSelectToggle = (id: number) => basketAdapter.selectToggle(id);

  return (
    <Checkbox checked={selected.includes(props.id)} onPress={() => handleSelectToggle(props.id)} />
  );
};
