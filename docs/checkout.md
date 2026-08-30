# Checkout — перенос страницы оформления заказа на React Native

## Контекст

- **Источник (веб):** `/Users/i-mobi/code/projects/front/shop-web/src/app/checkout/`
  - `page.tsx` — серверная страница (загрузка данных + разметка)
  - `action.ts` — типы, `fetchCheckoutData`, `checkingBalanceAction`, `createOrderAction`, `fetchForwardAction`, `fetchReverseAction`
  - `schema.ts` — zod-валидация заказа
  - `components/` — блоки страницы
- **Цель (мобильный):** `/Users/i-mobi/code/projects/mobile/shop/src/screen/Checkout/CheckoutScreen.tsx` (сейчас пустая заглушка)
- **Стек мобильного:** React Native 0.87, zustand (`src/store/services/create-store.ts`), `fetchService` (`src/shared/fetch-api/`), `react-native-svg`, zod, `CONFIG_APP.MAPBOX_*` в `.env`

### Что переносим (4 блока)

| № | Блок | Веб-исходник |
|---|------|--------------|
| 1 | Способ оплаты | `components/BasketMethodCard/BasketMethodCard.tsx` |
| 2 | Дата и время | `components/DeliveryDateCard/DeliveryDateCard.tsx` + `shared/ui/select-week-date/`, `shared/ui/select-delivery-time/` |
| 3 | Дополнительная информация | `components/AdditionalInformation/AdditionalInformation.tsx` |
| 4 | Способ получения | `components/MethodReceiptCard/`, `components/SelectMethodReceipt/` (без карты — см. ниже) |
| 5 | Панель «Ваш заказ» + Оформить | web: `src/app/basket/components/BasketOrder/BasketOrder.tsx` → аналог мобильного `BasketFooter` (логика меняется) |

### Что НЕ переносим

- «Вы недавно смотрели» и «Подобрали для вас» (carousel) — по решению пользователя
- Карта Mapbox в задаче 4 — **отдельная задача**, решение по варианту (WebView / нативный / без карты) пользователь ещё рассматривает. В задаче 4 карту и геокодинг не делаем.
- `OrderSuccessModal` — вместе с задачей 5 (BasketOrder)

### Порядок работы

1. Подготовительный этап (общий для всех блоков)
2. Задача 1 → **проверка пользователем**
3. Задача 2 → **проверка пользователем**
4. Задача 3 → **проверка пользователем**
5. Задача 4 → **проверка пользователем**
6. Задача 5 (BasketOrder) → **проверка пользователем**

Каждая задача выполняется отдельным коммитом/этапом. После каждого шага — `lint` + `tsc` + `jest`.

---

## Подготовительный этап (общий)

### Шаг 0.1 — Store checkout

Создать `src/store/checkout/` по образцу веб `src/stores/checkout/`:

- `types.ts` — `AddressItem`, `CheckoutInitState` (поля из web 1:1: `payment_method`, `delivery_date`, `delivery_time`, `method_receipt`, `activePickup`, `activeCourier`, `courierAddress`, `comment`, `phone`, `recipient_name`, `*_error`)
- `store.ts` — `createStore<CheckoutInitState>(инициализация, "checkout")`
- `adapter.ts` — методы: `changePaymentMethod`, `setDeliveryDate`, `setDeliveryTime`, `setMethodReceipt`, `setActiveAddress`, `addAddress`, `deleteAddress`, `changeAdditionalInfoInputs`, `activeErrorAdditionalInfoInputs`

Внимание: `setDeliveryTime` на вебе тоглится (повторный клик — 0), перенести логику 1:1.

### Шаг 0.2 — Общие UI-компоненты

Создать в `src/shared/ui/` (или `src/screen/Checkout/components/`):

- `InfoCard.tsx` — карточка блока с заголовком (аналог `BasketInfoCard`)
- `SelectableCard.tsx` — переиспользуемая карточка выбора (иконка + заголовок + подзаголовок, активное состояние) — понадобится в задачах 1 и 4
- `FieldInput.tsx` — инпут с label/placeholder/error (аналог веб `Input` + `TextAreaResize`) — понадобится в задаче 3

### Шаг 0.3 — Загрузка данных на экране

На вебе данные грузит серверная `fetchCheckoutData`. На RN SSR нет — грузим на экране через `fetchService` (паттерн как в `BasketScreen.tsx`):

- `product/by-ids?ids={basketIds}` — товары из корзины (`basketStore.items`)
- `cart-discounts/active` и `promotions/active` — можно отложить до задачи BasketOrder (пока не нужны блокам)
- `warehouses/public` — склады самовывоза (нужно для задачи 4)

Отсюда получаем `pickupAddress` (address из warehouses) и `defaultCenter` (склад с `default_warehouse`, fallback `{ lng: 37.80358599891716, lat: 48.013597598505555 }`).

### Шаг 0.4 — Каркас CheckoutScreen

- Контейнер: `SafeAreaView` + `KeyboardAvoidingView` + `ScrollView` (блоки в столбик)
- Разметка-заглушка под 4 блока (порядок как на вебе):
  1. Способ оплаты
  2. Дата и время
  3. Способ получения
  4. Дополнительная информация
- Навигация уже подключена: `BasketStack` в `src/navigation/TabNavigator.tsx:37`, переход `navigation.push("Checkout")` в `BasketFooter.tsx:84`

---

## Задача 1. Способ оплаты

**Веб-исходник:** `components/BasketMethodCard/BasketMethodCard.tsx` + `shared/svg/CashSvg`, `BankCardSvg`

**Готовность:** нужен Шаг 0.1 (поле `payment_method` + `changePaymentMethod`)

### Шаги

1. Иконки: на вебе `CashSvg`/`BankCardSvg` → нарисовать SVG-компоненты в `src/shared/svg/` (react-native-svg), либо упрощённые варианты
2. Компонент `PaymentMethodCard.tsx` (в `src/screen/Checkout/components/`):
   - Карточка «Наличными / При получении» → `payment_method = "cash"` (дефолт)
   - Карточка «Банковской картой / Или QR при получении» → `payment_method = "card"`
   - Активная карточка подсвечивается (у веба синий/фиолетовый акцент — взять брендовый цвет из мобильного, `#f86c25`/`#a73afd`)
3. Подключить в `CheckoutScreen` на место блока 1

### Проверка

- [ ] Переключение способа оплаты меняет `checkoutStore.payment_method`
- [ ] Активное состояние карточки визуально отличается
- [ ] `lint` + `tsc` + `jest` проходят

---

## Задача 2. Дата и время

**Веб-исходник:** `components/DeliveryDateCard/DeliveryDateCard.tsx`, `shared/ui/select-week-date/SelectWeekDate.tsx`, `shared/ui/select-delivery-time/SelectDeliveryTime.tsx`, `shared/helpers/getSelectDeliveryDate.ts`

**Готовность:** нужен Шаг 0.1 (поля `delivery_date`, `delivery_time`)

### Шаги

1. Перенести хелперы:
   - `getSelectDeliveryDate` (возврат к сегодняшней дате, если протухла/пустая)
   - `getWeekDays(dateFrom, countDay, endWork)` — если до конца рабочего дня < 3 ч, список дней начинается со следующего
   - `getDayTimes(selectDate, todayDate, endWork)` — если сегодня: с 10:00 или `currentHours + 2`, до 19:00
2. UI «Даты»: горизонтальная лента из 11 дней (`FlatList horizontal` или `ScrollView`), день недели («Пн»...) + «01 сен», активная сегодня, выбранная — по `delivery_date` (`toDateString()`)
3. UI «Время»: сетка из часов «с X:00 — до X+1:00», тап повторно по выбранному — сброс в 0 (логика `setDeliveryTime`)
4. Поведение из `DeliveryDateCard.handleChangeDeliveryDate`:
   - повторный тап по текущей дате → сброс на сегодня
   - если выбрана сегодня и до конца работы < 3 ч → авто-переход на завтра
   - если выбрана сегодня и `delivery_time < currentHours + 2` → авто-коррекция времени
5. Подключить на место блока 2

### Проверка

- [ ] Лента дат: 11 дней, сегодня подсвечена, выбор сохраняется в store
- [ ] Время: часы 10–19, для «сегодня» начинается с `currentHours + 2`
- [ ] Автологика «< 3 ч до конца дня» и «повторный тап» работают как на вебе
- [ ] `lint` + `tsc` + `jest` проходят

---

## Задача 3. Дополнительная информация

**Веб-исходник:** `components/AdditionalInformation/AdditionalInformation.tsx`

**Готовность:** нужен Шаг 0.1 (поля `comment`, `phone`, `recipient_name` + `*_error`) и Шаг 0.2 (`FieldInput`)

### Шаги

1. Поля:
   - `Имя получателя` — text, maxLength 50, `recipient_name`
   - `Телефон получателя` — маска, префикс `+7`, maxLength 13, `phone`
   - `Комментарий` — многострочный, maxLength 1000, `comment`
2. Маска телефона (перенести 1:1 из web `handleChangePhone`):
   - убираем не-цифры → формат `XXX XXX XX XX` (пробелы)
3. Ошибки: `phone_error`, `recipient_name_error`, `comment_error` — показываются под полями, очищаются при вводе (`changeAdditionalInfoInputs`)
4. Метод `activeErrorAdditionalInfoInputs` — готов для серверных ошибок из `createOrderAction` (пригодится в BasketOrder)
5. Подключить на место блока 4 (на вебе блок идёт последним)

### Проверка

- [ ] Маска телефона форматирует как на вебе
- [ ] Ввод очищает ошибку поля
- [ ] Ограничения длины (50 / 13 / 1000) соблюдены
- [ ] `lint` + `tsc` + `jest` проходят

---

## Задача 4. Способ получения

**Веб-исходник:** `components/MethodReceiptCard/`, `components/SelectMethodReceipt/` + `shared/helpers/getFullAddressItem.ts`

**Готовность:** нужен Шаг 0.1 (поля `method_receipt`, `activePickup`, `activeCourier`, `courierAddress`), Шаг 0.3 (warehouses), Шаг 0.4

⚠️ **Важно:** карта (Mapbox) и геокодинг (`fetchForwardAction`/`fetchReverseAction`) в эту задачу **НЕ входят** — это отдельная задача, пользователь рассматривает варианты реализации. Сейчас делаем только переключатель способа получения и **список** складов.

### Шаги

1. Переключатель способа получения: карточки «Самовывоз» (мин. сумма 0 ₽) / «Курьером» (мин. 5000 ₽) → `method_receipt` (дефолт `pickup`)
2. Данные: из `warehouses/public` собрать `pickupAddress: AddressItem[]` (`type: "pickup"`), `defaultCenter` — из `default_warehouse`
3. Список складов самовывоза (аналог `ModalSelectAddress` на вебе):
   - показываем для `pickup`, выбор склада → `activePickup`
   - активный склад подсвечен, имя/адрес — через `getFullAddressItem`
   - кнопка «Выбрать склад» / «Изменить» — по наличию `activePickup`
4. Для `courier` — заглушка «Добавление адреса курьера появится с картой» (отдельная задача). Поле `method_receipt` и Мин. сумма 5000 ₽ работают уже сейчас.
5. Карточка выбранного адреса: «Адрес самовывоза:» + полный адрес + мин. сумма + способ оплаты
6. Подключить на место блока 3 (после «Дата и время»)

### Проверка

- [ ] Переключение самовывоз/курьер меняет контент ниже
- [ ] Выбор склада из `pickupAddress` сохраняется в `activePickup`
- [ ] Текст карточки адреса (мин. сумма + оплата) совпадает с вебом
- [ ] `lint` + `tsc` + `jest` проходят

---

## Задача 5. Панель «Ваш заказ» + кнопка «Оформить»

**Веб-исходник:** `src/app/basket/components/BasketOrder/BasketOrder.tsx` + `src/app/checkout/action.ts` (`checkingBalanceAction`, `createOrderAction`) + `src/app/checkout/schema.ts` + `components/OrderSuccessModal/`

**Готовность:** нужны задачи 1–4, Шаг 0.3 (загрузка товаров/скидок/акций)

**Важно:** у пользователя уже есть похожий компонент — мобильный `BasketFooter` (`src/screen/Basket/components/BasketFooter.tsx`). Берём его за основу, логика меняется: вместо «К оформлению» — «Оформить» + сводка заказа.

### Шаги

1. Компонент `CheckoutFooter.tsx` (в `src/screen/Checkout/components/`), по образцу `BasketFooter`:
   - сводка: товары (кол-во, сумма со скидками через `calcBasketInfo`), количество/корзинная/акционная скидки, доставка (100 ₽ для курьера, 0 для самовывоза), способ оплаты, способ получения, адрес, дата и время, итого
   - кнопка «Оформить», disabled если нет адреса (для checkout)
   - чекбокс согласия с правилами
2. `checkingBalanceAction` — повторно проверяем остатки перед созданием заказа (уже есть в `BasketFooter`, переиспользовать паттерн + `StockWarningModal`)
3. `createOrderAction`:
   - zod `createOrderSchema` из web `schema.ts` перенести в mobile (zod уже установлен)
   - payload: `payment_method`, `date_from`/`date_to` (из `delivery_date` + `delivery_time`, хелперы `getDateFromAndDateTo`, `getDeliveryTimeDisplay`), `method_receipt`, `comment`, `phone` (только цифры), `phoneCode: "+7"`, `recipient_name`, `address` (активный склад), `products` (из `basketStore`: `selected` + `items`)
   - `fetchService.post("orders/create", payload)`
   - ошибки валидации → в `checkoutStore` (`activeErrorAdditionalInfoInputs`)
4. После успеха: очистить корзину (`basketAdapter.delete` по товарам), сбросить поля checkout, показать `SuccessOrderModal` (аналог web) → переход на заказ/главную
5. Подключить в `CheckoutScreen` как нижнюю панель (аналог `BasketFooter`)

### Проверка

- [ ] Сводка заказа совпадает с вебом (скидки, доставка, итого)
- [ ] Валидация полей из задачи 3 показывает ошибки под инпутами
- [ ] Успешный заказ: корзина очищена, модалка успеха, переход
- [ ] `lint` + `tsc` + `jest` проходят

---

## Отдельные задачи на будущее (вне этого плана)

- Карта Mapbox (выбор адреса курьера на карте, `fetchForwardAction`/`fetchReverseAction`) — решение по варианту реализации за пользователем
- «Вы недавно смотрели» и «Подобрали для вас»