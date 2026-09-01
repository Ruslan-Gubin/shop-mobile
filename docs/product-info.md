# ProductInfoScreen — перенос страницы информации о товаре на React Native

## Контекст

- **Источник (веб):** `/Users/i-mobi/code/projects/front/shop-web/src/app/catalog/detail/[id]/`
  - `page.tsx` — серверная страница (загрузка данных + сборка блоков)
  - `action.ts` — типы (`ReviewModel`, `QuestionModel`, `CreateReviewPayload`, `EditReviewPayload`) + `fetchProductDetail` + action-ы отзывов/вопросов
  - `components/DetailWrapper.tsx` — шапка (AddRecent, DetailHeader) + `detailContent` (Photos, DetailInfo, ActionBasket)
  - `components/DetailInfo/` — название, бренд, активность (рейтинг/вопросы), цена, описание, характеристики, габариты, категории
  - `components/Photos/` — галерея фото
  - `components/ActionBasket/` — цена + добавление в корзину (sticky-панель)
  - `views/user-activity/UserActivity.tsx` — переключатель «Оценки / Вопросы» (на вебе через таб) + `ActivityReviews`, `ActivityQuestions`
  - `widgets/carousel-products/CarouselProducts.tsx` — горизонтальный карусель «Похожие», «С этим товаром покупают», «Вы недавно смотрели»
  - `widgets/product/product-section/ProductSection.tsx` — вертикальный блок «Рекомендуем»
- **Цель (мобильный):** `/Users/i-mobi/code/projects/mobile/shop/src/screen/ProductInfo/ProductInfoScreen.tsx` (сейчас пустая заглушка)
- **Стек мобильного:** React Native 0.87, zustand (`src/store/services/create-store.ts`), `fetchService` (`src/shared/fetch-api/`), `react-native-svg`, zod

### Что переносим (8 блоков)

| № | Блок | Веб-исходник | Мобильный аналог |
|---|------|--------------|------------------|
| 0 | Подготовка: store, загрузка данных, загрузка фото, UI-примитивы | `fetchProductDetail` | — |
| 1 | Галерея фото | `components/Photos/Photos.tsx` | **новый** `components/Photos.tsx` |
| 2 | Информация о товаре | `components/DetailInfo/DetailInfo.tsx` (`DetailInfo.module.css`) | **новый** `components/ProductInfo.tsx` |
| 3 | Панель покупки (цена + в корзину) | `components/ActionBasket/` + `ProductBasketActions`, `ProductPrice` | переиспользовать `AddBasket*`, `ProductPrice` |
| 4 | Блок «Отзывы и Вопросы» (2 блока-счётчика) | `views/user-activity/UserActivity.tsx` (только шапка-переключатель) | **новый** `components/ActivityTabs.tsx` |
| 5 | Горизонтальный список отзывов | `ActivityReviews.tsx` (осталось сделать в 4) | **новый** `components/ReviewsList.tsx` |
| 6 | «Похожие» и «С этим товаром покупают» | `CarouselProducts` | переиспользовать `HorizontalProductList` |
| 7 | «Рекомендуем» (вертикальный) | `ProductSection` | **переиспользовать** `ProductRecommended` |
| 8 | «Вы недавно смотрели» (горизонтальный) | `CarouselProducts` | **переиспользовать** `ProductRecent` |

### Ключевые отличия от веба (по решению пользователя)

1. На вебе «Оценки / Вопросы» — **переключатель-таб**, показывается один список.
   В мобильной версии таба НЕТ. Вместо него — **два блока-счётчика** («Отзывы», «Вопросы» с количеством), каждый при нажатии переходит на **отдельный экран** (аналог веб-роутов `reviews/[product_id]`, `questions/[product_id]`).
2. Ниже (прямо на этом скрине) показывает **только горизонтальный список отзывов**, если они есть. Список вопросов на этом экране НЕ показываем.
3. Далее порядок блоков как на вебе:
   - «Похожие товары» (горизонтальный скролл, как «Вы смотрели»)
   - «С этим товаром покупают» (горизонтальный скролл)
   - «Рекомендуем» (вертикальный список — **уже есть** `ProductRecommended`)
   - «Вы недавно смотрели» (горизонтальный — **уже есть** `ProductRecent`)

### Что НЕ переносим

- Экран отзывов и экран вопросов целиком (`reviews/[product_id]`, `questions/[product_id]`) — отдельные будущие задачи, здесь только переходы на них.
- Формы написания отзыва/вопроса, редактирование/удаление своего отзыва — живут на экранах Отзывы/Вопросы, а не на этом.
- Брендовая ссылка и переход по категориям — на мобильном пока только отображение (переходы при появлении экранов Бренды/Каталог).
- Кнопка «скопировать ссылку» (нативный аналог при необходимости — отдельно).

### Порядок работы

1. Подготовительный этап (общий для всех блоков)
2. Задача 1 (фото) → **проверка пользователем**
3. Задача 2 (инфо) → **проверка пользователем**
4. Задача 3 (покупка) → **проверка пользователем**
5. Задача 4 (Отзывы/Вопросы блоки) → **проверка пользователем**
6. Задача 5 (список отзывов) → **проверка пользователем**
7. Задача 6 (Похожие + С этим покупают) → **проверка пользователем**
8. Задача 7 (Рекомендуем) → **проверка пользователем**
9. Задача 8 (Вы недавно смотрели) → **проверка пользователем**

Каждая задача выполняется отдельным коммитом/этапом. После каждого шага — `lint` + `tsc` + `jest`.

---

## Подготовительный этап (общий)

### Шаг 0.1 — Экран ProductInfo в навигации + каркас

- `ProductInfoScreen.tsx` уже зарегистрирован в `HomeStack`, `BasketStack`, `ProfileStack` (`src/navigation/TabNavigator.tsx`). Проверить, что приходит `route.params.id`.
- Экран принимает `navigation` и `route` (`{ params: { id: number } }`).
- Каркас: `SafeAreaView` + `ScrollView`, внутри последовательно будут блоки (сверху вниз):
  1. Галерея фото
  2. Информация о товаре (+ цена)
  3. Панель покупки
  4. Блоки «Отзывы / Вопросы» (счётчики)
  5. Горизонтальный список отзывов (если есть)
  6. «Похожие товары»
  7. «С этим товаром покупают»
  8. «Рекомендуем»
  9. «Вы недавно смотрели»
- Переход с `ProductCard` → `navigation.push("ProductInfo", { id })` уже есть на проекте.

### Шаг 0.2 — Загрузка данных на экране (аналог `fetchProductDetail`)

На RN SSR нет — грузим на экране через `fetchService` (паттерн как в `BasketScreen.tsx`, `ProductRecommended`). Один композитный запрос или несколько `fetchService.get` параллельно (через `Promise.all`), по образцу веб `fetchProductDetail`:

- `product/increment-view/{id}` — **увеличить счётчик просмотра + вернуть товар** (на вебе первый загрузочный `ProductModel`)
- `product-price/for-user/{id}` — `{ price, minQuantity }[]` (для цены и корзины)
- `product-specifications/product/{id}` — характеристики `ProductSpecificationModel[]`
- `product-stock/product-available/{id}` — `{ available, accounting } | null` (наличие)
- `product-review/product/{id}?page=1&limit=30` — `{ reviews, totalCount, paginationPage }` (для счётчика «Отзывы» и горизонтального списка)
- `product-question/product/{id}?page=1&limit=30` — `{ questions, totalCount, paginationPage }` (для счётчика «Вопросы»)
- `product/similar/{id}` — `ProductModel[]` («Похожие товары»)
- `product/buy-together?ids={id}` — `ProductModel[]` («С этим товаром покупают»)
- «Рекомендуем» и «Вы недавно смотрели» — грузятся внутри своих переиспользуемых виджетов (`ProductRecommended`, `ProductRecent`), на этом экране их **не дублируем**.

Поля `favorite_ids`, `cart_ids`, `viewed_ids` для `product/recommended` уже берутся из store внутри `ProductRecommended`.

Вынести загрузку в `src/screen/ProductInfo/` (например `useProductInfo.ts` хук или `api.ts`), собрать состояние `loading` / `error` / `data`.

### Шаг 0.3 — Store/адаптер «Недавно просмотренные»

При открытии добавлять товар в `recentStore` — аналог веб `AddRecent.tsx` (вызывается с `product_id`, см. `src/store/recent/adapter.ts` — метод `add` уже есть). Вызвать в `useEffect` на экране.

### Шаг 0.4 — Загрузка фото (`ImageMain`)

Проверить `src/shared/ui/image/ImageMain.tsx` — компонент изображения с `react-native-vector-image`. Использовать его для фото (fallback на пустое изображение, как веб `EMPTY_IMG_SVG`).

---

## Задача 1. Галерея фото

**Веб-исходник:** `components/Photos/Photos.tsx` + `shared/types/photo.ts` (уже есть `src/shared/types/photo.ts`)

**Готовность:** Шаг 0.4 (`ImageMain`), данные `photos` из `increment-view`

### Шаги

1. Компонент `ProductPhotos.tsx` (в `src/screen/ProductInfo/components/`):
   - большая выбранная картинка
   - горизонтальная лента миниатюр (`FlatList horizontal`), тап по миниатюре меняет выбранную (аналог `selectPhoto`)
   - состояние `selectPhoto: number`, индикатор активной
2. Пустые фото (нет `url`) → placeholder.
3. Подключить в `ProductInfoScreen` на место блока 1.

### Проверка

- [ ] Переключение миниатюр меняет главное фото
- [ ] Активная миниатюра подсвечена
- [ ] `lint` + `tsc` + `jest` проходят

---

## Задача 2. Информация о товаре

**Веб-исходник:** `components/DetailInfo/DetailInfo.tsx` + `shared/helpers/getSpecificationsProductInfo.ts`, `getProductDimensions.ts` (перенести хелперы)

**Готовность:** Шаг 0.2 (данные `product`, `specifications`, `prices`, `stocks`)

### Шаги

1. Перенести хелперы в `src/shared/helpers/`:
   - `getSpecificationsProductInfo` — сбор характеристик
   - `getProductDimensions` — габариты (вес/высота/длина/ширина)
2. Компонент `ProductInfo.tsx`:
   - название, бренд (текст-ссылка на будущий экран Бренды)
   - блок активности (рейтинг `RatingBadge` + кол-во отзывов, кол-во вопросов) — используется переиспользуемый `widgets/product/rating-badge/RatingBadge.tsx`, обёртка-счётчик вопросов из `shared/svg/ReviewSvg.tsx`
   - цена (через `ProductPrice`/`getCurrentPrice`)
   - «Описание» (макс длина 250 + кнопка «ещё»)
   - «Характеристики» (список из `getSpecificationsProductInfo`)
   - «Габариты» (список из `getProductDimensions`)
   - категория/бренд внизу (отображение, переходы — при появлении экранов)
3. Подключить в `ProductInfoScreen` на место блока 2.

### Проверка

- [ ] Название, бренд, рейтинг, цена отображаются
- [ ] Характеристики и габариты собираются как на вебе
- [ ] «Нет в наличии», если `stocks` говорит об отсутствии
- [ ] `lint` + `tsc` + `jest` проходят

---

## Задача 3. Панель покупки (цена + в корзину)

**Веб-исходник:** `components/ActionBasket/ActionBasket.tsx` + `ProductBasketActions`, `ProductPrice` (sticky)

**Готовность:** Шаг 0.2 (`prices`, `stocks`), существующие виджеты корзины

### Шаги

1. Использовать **переиспользуемые** мобильные виджеты (уже есть):
   - `widgets/product/add-basket/AddBasket.tsx` и `add-basket-large/AddBasketLarge.tsx`
   - `widgets/product/product-price/ProductPrice.tsx`
   - `widgets/product/basket-card-action/BasketCardAction.tsx`
2. Компонент `PurchasePanel.tsx` (нижняя панель, аналог sticky `ActionBasket`):
   - цена (крупная, `ProductPrice`)
   - кнопка «В корзину» / счётчик количества / «Нет в наличии» (по `stocks.accounting/available`)
   - добавить в корзину через `basketAdapter` (см. `src/store/basket/`)
3. Подключить в `ProductInfoScreen` (панель прижата к низу, поверх скролла).

### Проверка

- [ ] Добавление в корзину обновляет `basketStore`
- [ ] Поведение «Нет в наличии» совпадает с вебом
- [ ] Счётчик количества работает корректно
- [ ] `lint` + `tsc` + `jest` проходят

---

## Задача 4. Блоки «Отзывы» и «Вопросы» (счётчики + переходы)

**Веб-исходник:** `views/user-activity/UserActivity.tsx` (только шапка с двумя кнопками-счётчиками)

**Готовность:** Шаг 0.2 (данные `product-review/*`, `product-question/*`)

### Шаги

1. Компонент `ActivityTabs.tsx` (в `src/screen/ProductInfo/components/`):
   - **два блока подряд** (НЕ таб-переключатель):
     - «Отзывы» + счётчик (`reviews.totalCount`) → `navigation.push("ReviewsScreen", { id })`
     - «Вопросы» + счётчик (`questionData.totalCount`) → `navigation.push("QuestionsScreen", { id })`
   - счётчик скрывается, если `totalCount === 0`
2. Счётчики — кликабельные блоки с иконкой (`shared/svg/ReviewSvg.tsx`, новый `QuestionSvg` при необходимости).
3. Экран Отзывы (`ReviewsScreen`) и экран Вопросы (`QuestionsScreen`) — **пока заглушки** (будут наполняться отдельными задачами). Зарегистрировать маршруты переходов (например в нужных стеках `TabNavigator.tsx`).
4. Подключить в `ProductInfoScreen` на место блока 4.

### Проверка

- [ ] Оба блока показывают корректное количество
- [ ] Тап по «Отзывы»/«Вопросы» открывает нужный (пока заглушечный) экран
- [ ] Нет таба-переключателя между ними
- [ ] `lint` + `tsc` + `jest` проходят

---

## Задача 5. Горизонтальный список отзывов

**Веб-исходник:** `ActivityReviews.tsx` (часть списка: карточка отзыва) + `RatingInfo` (сводный рейтинг)

**Готовность:** задачи 4 (данные `reviews`, `totalRating`), Шаг 0.2

### Шаги

1. Свести рейтинг: блок с общим баллом и кол-вом (аналог `RatingInfo`, переиспользовать `RatingBadge`).
2. Компонент `ReviewsList.tsx` (ретёрн задачи 4, показывается **только если есть отзывы** — `reviews.length > 0`):
   - горизонтальный скролл (`FlatList horizontal`), по образцу `HorizontalProductList`
   - карточка отзыва: дата (формат через `formatters.formatDateLong` → перенести в `src/shared/helpers/formatters.ts`), звёзды рейтинга, «Достоинства», «Недостатки», «Комментарий»
3. Ссылка/кнопка «Смотреть все отзывы» → `ReviewsScreen`.
4. Подключить в `ProductInfoScreen` на место блока 5.

⚠️ **Вопросы на этом экране НЕ показываем** — список вопросов живёт только на экране Вопросы.

### Проверка

- [ ] Отзывы скроллятся горизонтально
- [ ] Карточка отзыва: дата, звёзды, тексты — совпадают с вебом
- [ ] Блок скрыт, если отзывов нет
- [ ] `lint` + `tsc` + `jest` проходят

---

## Задача 6. «Похожие товары» + «С этим товаром покупают»

**Веб-исходник:** `CarouselProducts.tsx` (горизонтальная лента с `ProductCard`)

**Готовность:** Шаг 0.2 (данные `similar`, `buyTogether`)

### Шаги

1. Перенести типы: `ProductModel`, `PhotoModel` — уже есть в `src/shared/types/`.
2. Использовать **переиспользуемый** `HorizontalProductList` (`src/widgets/product/horizontal-product-list/HorizontalProductList.tsx`) — он ровно про горизонтальный скролл карточек (как «Вы смотрели»):
   - «Похожие товары» — `HorizontalProductList`, только если `similar.length > 0`
   - «С этим товаром покупают» — `HorizontalProductList`, только если `buyTogether.length > 0`
3. `navigation` передать в карточки для перехода в `ProductInfo`.
4. Подключить в `ProductInfoScreen` на место блоков 6 и 7.

### Проверка

- [ ] Оба блока показываются только при непустых данных
- [ ] Горизонтальный скролл работает, карточка открывает `ProductInfo`
- [ ] `lint` + `tsc` + `jest` проходят

---

## Задача 7. «Рекомендуем» (вертикальный список)

**Веб-исходник:** `ProductSection.tsx` → вертикальный `ProductList`

**Готовность:** уже реализован на проекте

### Шаги

1. **Переиспользовать существующий** `ProductRecommended.tsx` (`src/widgets/product/product-recommended/`), уже используется на `ProfileScreen` («Подобрали для вас»). Он сам грузит `product/recommended` и рисует вертикальный список карточек.
2. Точка вызова: `<ProductRecommended title="Рекомендуем" navigation={navigation} />`.
3. Подключить в `ProductInfoScreen` на место блока 8.

### Проверка

- [ ] Вертикальный блок «Рекомендуем» рендерится и грузит данные
- [ ] Не дублирует загрузку (запрос идёт внутри `ProductRecommended`)
- [ ] `lint` + `tsc` + `jest` проходят

---

## Задача 8. «Вы недавно смотрели» (горизонтальный список)

**Веб-исходник:** `CarouselProducts.tsx` с `headerLink` «Смотреть все» → `/recent`

**Готовность:** уже реализован на проекте

### Шаги

1. **Переиспользовать существующий** `ProductRecent.tsx` (`src/widgets/product/product-recent/`), используется на `ProfileScreen`/`SearchScreen`. Он сам грузит `product/by-ids` по `recentStore` и рисует горизонтальный `HorizontalProductList`.
2. Передать `isHasNavigateSeeAll` для кнопки «Все →» → `RecentScreen`.
3. Подключить в `ProductInfoScreen` на место блока 9 (последний блок).

### Проверка

- [ ] Горизонтальный блок «Вы недавно смотрели» рендерится только при наличии просмотров
- [ ] Кнопка «Все →» ведёт на `RecentScreen`
- [ ] `lint` + `tsc` + `jest` проходят

---

## Отдельные задачи на будущее (вне этого плана)

- Экран «Все отзывы» (`ReviewsScreen`), наполнение по образцу веб `app/reviews/[product_id]/` (список + моя форма отзыва, создать/изменить/удалить → `createReviewAction`/`editReviewAction`/`deleteReviewAction` из `action.ts`)
- Экран «Все вопросы» (`QuestionsScreen`), наполнение по образцу веб `app/questions/[product_id]/` (список + форма вопроса → `createQuestionAction`)
- Форма написания отзыва/вопроса на самих экранах (валидация `createReviewSchema` → zod)
- Переходы по бренду и категории на соответствующие экраны
- Кнопка «скопировать ссылку» (нативный аналог)
