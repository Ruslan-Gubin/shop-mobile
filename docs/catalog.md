# Catalog — экран «Каталог» на React Native

## Контекст

- **Источник (веб):** `/Users/i-mobi/code/projects/front/shop-web/src/app/catalog/`
  - `page.tsx` — сборка страницы каталога (серверный компонент)
  - `action.ts` — `fetchCatalogData` (цепочка: search, recent, fullPathCategories, filters, catalog)
  - `Categories/Filter/Filter.tsx` — фильтры (сортировка, цена, характеристики, страна, вид товара, категория)
  - `Categories/Wrapper/Wrapper.tsx` — подкатегории + список товаров
  - `Categories/Products/Products.tsx` — список товаров с load-more
  - `Categories/SimilarSearch/SimilarSearch.tsx` — похожие поисковые запросы
- **Цель (мобильный):** `/Users/i-mobi/code/projects/mobile/shop/src/screen/Catalog/CatalogScreen.tsx` (сейчас заглушка)
- **Стек мобильного:** React Native 0.87, zustand, `fetchService` (`src/shared/fetch-api/`), `useInfiniteScroll` (`src/shared/hooks/useInfiniteScroll.ts`), react-native-svg

### API эндпоинты (совпадают с вебом)

| Метод | URL | Назначение |
|-------|-----|-----------|
| GET | `category/categories` | полное дерево категорий (для меню главных категорий) |
| GET | `category/fullPathCategories/{category_id}` | цепочка категорий + подкатегории текущей |
| GET | `product/catalog` | список товаров каталога (params: `limit, page, category_id, search, sort, price_from, price_to, specifications, country, product_types`) |
| GET | `product/filters` | параметры фильтров (params: `category_id, search, price_from, price_to`) |
| GET | `search` | похожие/автодополнение (params: `text, limit`) |

### Маршрут

`CatalogScreen` зарегистрирован в `HomeStack` (как `Home` → `Search` → `Catalog`) и `CatalogStack` (`ТабNavigator.tsx`). Экран принимает `route.params.search?`. Принимает `navigation` для переходов `Search`, `ProductInfo`.

## Сценарии (логика экрана)

Каталог имеет 4 состояния, определяемых **наличием `search`** и **выбранной категории**:

### Состояние A. Нет search, нет выбранной категории (меню категорий)
- Загружаем всё дерево `category/categories`.
- Показываем **только главные категории** (`parent_id === null`).
- Сверху — кнопка как на главной (`SearchNavigateButton`) для перехода на `Search`.

### Состояние B. Выбрали категорию с подкатегориями
- Загружаем `category/fullPathCategories/{id}`.
- Показываем подкатегории выбранной категории (`childrenCategories`).
- Кнопка перехода на Search **скрыта**. Вместо неё — `PageHeader` с кнопкой «назад», которая возвращает в меню каталога (на уровень выше / к главным категориям).
- Товары не показываем (в отличие от веба — в мобильном товары только листовой категории).

### Состояние C. Выбрали листовую категорию (нет подкатегорий)
- Загружаем `product/filters` и `product/catalog` (с `category_id`).
- Показываем фильтр + список товаров.
- `PageHeader` с кнопкой «назад».

### Состояние D. Есть search
- Кнопка перехода на Search **показывается**.
- Загружаем `search?text=` (похожие запросы), `product/filters`, `product/catalog` (с `search`).
- Показываем блок «похожие поисковые запросы» (SimilarSearch) + слово поиска + количество найденных, затем фильтр и список товаров.

## Ключевые отличия от веба (по решению пользователя)

1. **Нет хлебных крошек** — вместо них `PageHeader` с кнопкой «назад» (в меню каталога).
2. **Товары только листовой категории** — в вебе на промежуточном уровне показывалось всё товары подкатегорий, в мобильном — только товары выбранной листовой категории.
3. **В фильтре нет выбора категорий** — только: сортировка, цена, характеристики, страна, вид товара.
4. Каждый фильтр — `<Modal animationType="slide">`, выезжает **снизу вверх**, максимум ~80% высоты, по контенту при малом содержимом; при большом списке — внутренний скролл (не выходит за пределы).
5. Данные грузим через `fetchService` (паттерн `HomeScreen.tsx` / `ProductInfoScreen.tsx`), SSR в RN нет.

## Что переносим

| № | Блок | Веб-исходник | Мобильный аналог |
|---|------|--------------|------------------|
| 1 | Типы Category / CatalogFilters | `action.ts` | **новый** `src/shared/types/category.ts`, `catalog.ts` |
| 2 | Загрузка данных каталога | `action.ts` (`fetchCatalogData`) | **новый** `src/shared/api/catalog.ts` (или в screen) |
| 3 | PageHeader (заголовок + бэк) | `shared/ui/page-header/PageHeader.tsx` | **новый** `src/shared/ui/page-header/PageHeader.tsx` (как в `QuestionsScreen`) |
| 4 | Фильтры (слайд-модалы) | `Categories/Filter/` + dropdowns | **новый** `src/screen/Catalog/components/filter/` |
| 5 | Список товаров | `Products.tsx` + `ProductList` | переиспользуем `ProductCard` + `FlatList` (паттерн `HomeScreen`) |
| 6 | Похожие запросы | `SimilarSearch.tsx` | **новый** `src/screen/Catalog/components/SimilarSearch.tsx` |

## Что НЕ переносим

- Хлебные крошки (`BreadCrumbs`).
- Переход по дереву категорий внутри фильтра (`DropdownFilterCategory`).
- Карусель «Вы недавно смотрели» на странице каталога (веб `CarouselProducts`) — см. Favorites/Recent в мобильном.
- Переключатель размера карточек (`FilterLargeSize`/`FilterNormalSize`) — в мобильном не предусмотрен.

## Порядок работы

1. Задача 1 (типы + API) → **проверка**
2. Задача 2 (PageHeader + хранилище состояния каталога) → **проверка**
3. Задача 3 (фильтры: слайд-модалы) → **проверка**
4. Задача 4 (CatalogScreen: все состояния) → **проверка**
5. Задача 5 (интеграция навигации) → **проверка**
6. Итоговая проверка `lint` + `tsc` + `jest`

---

## Задача 1. Типы + API каталога

**Готовность:** нет зависимостей

### Шаги

1. Создать `src/shared/types/category.ts`:
   - `CategoryModel` — рекурсивная модель (как в вебе `action.ts`):
     `{ id, parent_id, position, moderated, is_active, created_user_id, name, description, product_count, image, created_at, updated_at, children: CategoryModel[] }`.
2. Создать `src/shared/types/catalog.ts`:
   - `CatalogFiltersResponse = { price: { min; max }; specifications: { id; name; type; values: string[] }[]; countries: string[]; product_types: string[] }`.
   - `CatalogResponse = { products: ProductModel[]; totalCount: number; paginationPage: string }`.
   - `CatalogParams` — параметры запроса `product/catalog`.
   - `FilterParams` — параметры запроса `product/filters`.
3. Создать `src/shared/api/catalog.ts` (как `fetchService`-функции):
   - `fetchCategories()` → GET `category/categories` → `CategoryModel[]`.
   - `fetchCategoryPath(id)` → GET `category/fullPathCategories/{id}` → `{ categories; childrenCategories; transitionCategories }`.
   - `fetchCatalogProducts(params)` → GET `product/catalog`.
   - `fetchCatalogFilters(params)` → GET `product/filters`.
   - `fetchSimilarSearch(text)` → GET `search?text=&limit=7`.

### Проверка

- [ ] Типы категорий/фильтров корректны и переиспользуемы
- [ ] API-функции используют `fetchService`, возвращают `ResponseData<T>`
- [ ] `lint` + `tsc` проходят

---

## Задача 2. Подготовка экрана: состояние + заголовок

**Готовность:** Задача 1

### Шаги

1. Использовать существующий `src/shared/ui/header/PageHeader.tsx` (заголовок + кнопка «назад») — уже подходит для возврата в меню каталога. Дополнить при необходимости вариантом с `subtitle` (слово/кол-во найденных при поиске).
2. Состояние каталога держим **локально в экране** (паттерн `ProductInfoScreen.tsx` / `HomeScreen.tsx` — без глобального store):
   - `selectedCategory: CategoryModel | null`
   - фильтры: `sort`, `priceFrom`, `priceTo`, `specifications: string[]`, `country: string[]`, `productTypes: string[]`.
3. Вспомогательный модуль API `src/screen/Catalog/api.ts`: сборка `FilterParams`/`CatalogParams` из локального состояния + вызовы `fetchService` (аналог веб `action.ts`).

### Проверка

- [ ] `PageHeader` переиспользуется
- [ ] Состояние локальное, по паттерну проекта
- [ ] `lint` + `tsc` проходят

---

## Задача 3. Фильтры (слайд-модалы)

**Готовность:** Задача 1, 2

### Шаги

1. Создать `src/screen/Catalog/components/filter/BottomSheetFilter.tsx` — обёртка над `<Modal animationType="slide">`:
   - выезжает снизу вверх, `justifyContent: "flex-end"`, `maxHeight: "80%"`.
   - если контента мало — `height: "auto"` (по контенту).
   - при большом списке — внутренний `ScrollView` (не выходит за пределы 80%).
   - заголовок + кнопка закрытия.
2. Создать компоненты фильтров:
   - `SortFilter.tsx` — радио-список (По популярности, По рейтингу, По возрастанию/убыванию цены, По новинкам).
   - `PriceFilter.tsx` — два числовых инпута «От/До» + «Сбросить»/«Готово» (валидация как веб).
   - `MultiSelectFilter.tsx` (реквизит `specification`, `account` count) — чекбоксы.
   - `CountryFilter.tsx` / `ProductTypeFilter.tsx` — чекбоксы (через тот же MultiSelect враппер).
3. `src/screen/Catalog/components/filter/FilterBar.tsx` — горизонтальный список кнопок-фильтров, каждая открывает свой BottomSheetFilter.

### Проверка

- [ ] Модалки выезжают снизу вверх (slide), максимум 80% высоты
- [ ] Список внутри скроллится, не выходит за границы
- [ ] Нет выбора категорий в фильтре
- [ ] `lint` + `tsc` проходят

---

## Задача 4. CatalogScreen (все состояния)

**Готовность:** Задача 1, 2, 3

### Шаги

1. Реализовать `CatalogScreen.tsx` (заменить заглушку):
   - Принимает `route.params.search?` и `navigation`.
   - Через `useEffect` на `[search, selectedCategory?.id]` запускаем загрузку данных по сценарию A/B/C/D.
   - Состояние A: список главных категорий (`parent_id === null`) + `SearchNavigateButton`.
   - Состояние B: подкатегории выбранной категории + `PageHeader` (back → меню).
   - Состояние C: `PageHeader` + `FilterBar` + список товаров (`FlatList` с `ProductCard`, `useInfiniteScroll`).
   - Состояние D: `SearchNavigateButton` + блок похожих запросов (SimilarSearch) + слово/количество + `FilterBar` + товары.
2. `SimilarSearch.tsx` — список похожих запросов (`search`), клик → `navigation.push("Catalog", { search: text })`.
3. Обработка загрузки/ошибки (ActivityIndicator, Alert + Повторить — паттерн `HomeScreen`).
4. Пустое состояние (`NotContent` «Товары не найдены»).

### Проверка

- [ ] Меню главных категорий
- [ ] Подкатегории выбранной категории
- [ ] Товары листовой категории
- [ ] Поиск (похожие запросы + слово/количество + товары)
- [ ] Кнопка Search → только в состояниях A и D
- [ ] `lint` + `tsc` + `jest` проходят

---

## Задача 5. Интеграция навигации

**Готовность:** Задача 4

### Шаги

1. `HomeStack` и `CatalogStack` уже регистрируют `Catalog` — убедиться, что параметры типизированы.
2. Из `SearchScreen` (`handleClickHistoryItem`) происходит `navigation.push("Catalog", { search: value })` — проверено.
3. Переход с карточек товара (`ProductCard`) на `ProductInfo` работает.
4. Дополнительно — переход на `Search` из каталога (`SearchNavigateButton` → `navigation.push("Search")`).

### Проверка

- [ ] Переход Search → Catalog по поиску
- [ ] Переход к товару из каталога
- [ ] Возврат назад в меню каталога
- [ ] `lint` + `tsc` проходят

---

## Итоговая проверка

- [ ] `CatalogScreen` соответствует всем 4 сценариям
- [ ] Логика совпадает с вебом (кроме оговорённых отличий)
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm test` — без ошибок
