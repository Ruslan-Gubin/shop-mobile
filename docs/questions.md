# QuestionsScreen — экран «Вопросы» на React Native

## Контекст

- **Источник (веб):** `/Users/i-mobi/code/projects/front/shop-web/src/app/questions/[product_id]/`
  - `page.tsx` — сборка страницы (product info + `QuestionsForm` + `QuestionsList`)
  - `action.ts` — `fetchQuestionsData` (загрузка stock/price/product/questions)
  - `components/form/QuestionsForm.tsx` — форма вопроса (textarea + submit/cancel + модалка результата)
  - `components/list/QuestionsList.tsx` — список вопросов с пагинацией (LoadMoreObserver)
  - `components/product-info/QuestionsProductInfo.module.css` — описание товара в шапке
- **Создание вопроса (веб):** `POST product-question/create`, payload `{ question, product_id }`, валидация длина 10–1000 (см. `app/catalog/detail/[id]/action.ts` → `createQuestionAction`)
- **Цель (мобильный):** `/Users/i-mobi/code/projects/mobile/shop/src/screen/Questions/QuestionsScreen.tsx` (сейчас заглушка)
- **Стек мобильного:** React Native 0.87, zustand, `fetchService` (`src/shared/fetch-api/`), `useInfiniteScroll` (`src/shared/hooks/useInfiniteScroll.ts`), zod, react-native-svg

### Маршрут

`QuestionsScreen` уже зарегистрирован в `HomeStack`, `BasketStack` (`src/navigation/TabNavigator.tsx`). Открывается из `ActivityTabs.tsx` через `navigation.push("QuestionsScreen", { id })`. Экран принимает `route.params.id`.

### Что переносим

| № | Блок | Веб-исходник | Мобильный аналог |
|---|------|--------------|------------------|
| 1 | Карточка вопроса | `QuestionsList.tsx` (li) | **вынести** `QuestionCard` в `src/widgets/question/QuestionCard.tsx` (сейчас в `src/screen/ProductInfo/components/QuestionCard.tsx`) |
| 2 | Шапка с кратким описанием товара | `components/product-info/QuestionsProductInfo` | **новый** блок в `QuestionsScreen` (имя + описание, вернуться назад) |
| 3 | Форма вопроса | `components/form/QuestionsForm.tsx` | **новый** `components/QuestionsForm.tsx` (FieldTextArea + кнопки + модалка результата) |
| 4 | Список вопросов | `components/list/QuestionsList.tsx` | **встроить** в `QuestionsScreen` через `FlatList` + `useInfiniteScroll` |

### Ключевые отличия от веба (по решению пользователя)

1. Данные грузим на экране через `fetchService` (паттерн как в `ProductInfoScreen.tsx` / `BasketScreen.tsx`), SSR в RN нет.
2. Пагинация — через переиспользуемый `useInfiniteScroll` с `product-question/product/{id}?page=&limit=`. `totalCount` и `paginationPage` приходят в ответе.
3. В шапке — **краткое описание товара** (имя + описание, без корзины/цены-блоков как на вебе), можно вернуться назад через `PageHeader`.
4. Валидация формы — длина вопроса от 10 до 1000 символов (как на вебе и в backend DTO).

### Что НЕ переносим

- Панель покупки / корзина / цена в шапке (веб `ProductInfo` + `basketActions`) — на мобильном шапка простая, только имя + описание.
- Scroll-to-question по `?question_id=` (веб `QuestionsList`) — в мобильном таких переходов нет.
- Переключение валю и «+7» телефона — не относится.

### Порядок работы

1. Задача 1 (вынести `QuestionCard` в widgets) → **проверка**
2. Задача 2 (QuestionsScreen: шапка + список) → **проверка**
3. Задача 3 (форма вопроса) → **проверка**
4. Итоговая проверка `lint` + `tsc` + `jest`

---

## Задача 1. Вынести QuestionCard в widgets

**Готовность:** нет зависимостей

### Шаги

1. Создать `src/widgets/question/QuestionCard.tsx` — копия текущего `src/screen/ProductInfo/components/QuestionCard.tsx` (без изменений логики).
2. Обновить импорт в `src/screen/ProductInfo/components/ActivityTabs.tsx` и всех местах использования на `../../widgets/question/QuestionCard`.
3. Удалить старый файл `src/screen/ProductInfo/components/QuestionCard.tsx`.

### Проверка

- [ ] `QuestionCard` импортируется из `widgets/question/` во всех местах
- [ ] Нет дублей компонента
- [ ] `lint` + `tsc` + `jest` проходят

---

## Задача 2. QuestionsScreen: шапка + список

**Веб-исходник:** `page.tsx` + `action.ts` + `components/product-info/QuestionsProductInfo`

**Готовность:** Задача 1 (`QuestionCard` в widgets)

### Шаги

1. `QuestionsScreen.tsx` принимает `navigation` и `route` (`{ params: { id: number } }`).
2. Загрузка данных через `fetchService` (паттерн `ProductInfoScreen.tsx`):
   - `product/{id}` или `product/increment-view/{id}` — для имени/описания товара
   - `product-question/product/{id}?page=1&limit=30` — вопросы (через `useInfiniteScroll`)
3. Шапка: `PageHeader` (title «Вопросы», onBack → `goBack`) + блок краткого описания товара (имя + описание).
4. Список вопросов: `FlatList` с `QuestionCard` (карточки по одному в колонку).
5. `useInfiniteScroll` для подгрузки следующих страниц.
6. Пустое состояние через `NotContent` («Пока нет вопросов»), загрузка через `ActivityIndicator`, ошибка через `ErrorAlert`.

### Проверка

- [ ] Имя + описание товара в шапке
- [ ] Список вопросов рендерится через `QuestionCard`
- [ ] Бесконечный скролл подгружает следующие страницы
- [ ] Пустое состояние и ошибка обработаны
- [ ] `lint` + `tsc` + `jest` проходят

---

## Задача 3. Форма вопроса

**Веб-исходник:** `components/form/QuestionsForm.tsx` + `createQuestionAction` + backend DTO

**Готовность:** Задача 2

### Шаги

1. `components/QuestionsForm.tsx` (в `src/screen/Questions/components/`):
   - Заголовок «Вопросы» + счётчик (`totalCount`), если `totalCount > 0`
   - `FieldTextArea` (label «Задайте вопрос о товаре», placeholder, `maxLength` 1000)
   - Кнопки «Задать вопрос» и «Отменить» (показываются, когда textarea активна)
2. Валидация: длина `10..1000` (как веб и DTO). Ошибка «Число символов от 10 до 1000».
3. Отправка: `fetchService.post("product-question/create", { question, product_id })`.
4. Модалка результата (через `BaseModal`):
   - success: «Спасибо за ваш вопрос» / «Вопрос будет опубликован вместе с ответом», сброс формы
   - error: «Не удалось создать вопрос» / «Попробуйте в другой раз»
5. После успешного создания добавить новый вопрос в список (или обновить счётчик).

### Проверка

- [ ] Валидация длины работает (10–1000)
- [ ] POST `product-question/create` отправляет корректный payload
- [ ] Модалка успеха/ошибки показывается
- [ ] Счётчик обновляется после создания
- [ ] `lint` + `tsc` + `jest` проходят

---

## Итоговая проверка

- [ ] `QuestionsScreen` полностью соответствует вебу по логике (форма + список)
- [ ] `QuestionCard` переиспользуется в widgets (ProductInfo + QuestionsScreen)
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm test` — без ошибок
