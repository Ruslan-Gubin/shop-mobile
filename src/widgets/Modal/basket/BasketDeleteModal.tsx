import { basketAdapter } from "../../../store/basket/adapter";
import { modalsAdapter } from "../../../store/modals/adapter";
import { modalsStore } from "../../../store/modals/store";
import { BaseModal } from "../base-modal/BaseModal";

type Props = {
  revalidateBasketAction: () => Promise<void>;
};

export const BasketDeleteModal = (props: Props) => {
  const deleteItems = modalsStore((store) => store.deleteItems);

  const closeModal = () => modalsAdapter.clearDeleteItems();

  const handleDeleteItemsInBasket = () => {
    for (let i = 0; i < deleteItems.length; i++) {
      basketAdapter.delete(deleteItems[i]);
    }
    closeModal();
    props.revalidateBasketAction();
  };

  return (
    <BaseModal
      onClose={closeModal}
      visible={deleteItems.length > 0}
      subtitleText="Вы уверены, что хотите продолжить?"
      errorText="Отменить данное действие будет невозможно!"
      title={deleteItems.length > 1 ? "Удалить выбранные товары" : "Удалить товар"}
      footerAction={{
        cancel: { text: "Отменить", action: closeModal, backgroundColor: "#f6f6f9" },
        submit: { text: "Удалить", action: handleDeleteItemsInBasket, backgroundColor: "#cd5c5c" },
      }}
    />
  );
};
