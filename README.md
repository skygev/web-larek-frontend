# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Документация

Применяемая архитектура и подход.

Архитектура проекта разрабатывается с использованием паттерна MVP, в котором основными слоями являются:

М (Data Model) Модели данных, отвечают за работу с данными;
V (View) - компоненты Представления, отвечающие за отображение данных на экране;
P (Presenter) код презентера не будет выделен в отдельный класс, а будет содержаться в основном скрипте приложения Index.ts

Также в приложении есть коммуникационный слой api.ts и другие.

Ниже представлены описание данных, а также структура проекта, включая классы и их взаимодействие.

Архитектура проекта и описание UML

## Основной функционал сайта.

Отображение товаров:

Пользователь видит список товаров (карточки) с названием, категорией, изображением и ценой.
Корзина:

В верхнем правом углу сайта отображается значок корзины с динамическим счетчиком.
При нажатии на кнопку "Добавить в корзину" товар добавляется в корзину.
Содержимое корзины отображается в модальном окне:
Список товаров с их количеством и ценой.
Итоговая сумма заказа.
Возможность удалить товар из корзины.
Оформление заказа:

После подтверждения содержимого корзины пользователь вводит контактные данные:
Способ оплаты (наличными или картой).
Адрес доставки, email и номер телефона.
После нажатия "Оплатить" появляется сообщение об успешном оформлении заказа.

## Слой Model

**1. Api (Работа с API)**

Описание:

Класс Api отвечает за взаимодействие с сервером. Он выполняет HTTP-запросы и обрабатывает ответы.

Поля:

• baseUrl: string (readOnly) – базовый URL API.

• options: RequestInit (protected) – настройки запроса (заголовки, параметры и т. д.).

Методы:

• handleResponse(response: Response): Promise<object> – обрабатывает ответ от сервера, парсит JSON или возвращает ошибку.

• get(uri: string): Promise<object> – выполняет GET-запрос по заданному uri.

• post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object> – отправляет POST, PUT или DELETE-запрос, принимает uri, данные и тип метода.

**2. LarekApi (Работа с API WebLarek)**

Описание:

Класс LarekApi выполняет взаимодействие с сервером WebLarek, загружает товары и оформляет заказы. Наследует класс Api и реализует интерфейс ILarekApi. Конструктор класса принимает URL-адрес хоста cdn, базовый URL-адрес baseUrl и опции для запроса options. В конструкторе вызывается конструктор родительского класса Api с переданными параметрами.

Поля:

• cdn: string (readonly) – URL для получения изображений товаров.

Методы:

• getProducts(): Promise<Product[]> – получает список товаров с сервера.

• getProduct(id: string): Promise<Product> – получает данные конкретного товара.

• createOrder(orderData: OrderData): Promise<OrderResponse> – отправляет заказ и получает ответ от сервера.

**3. Model<T> (Базовая модель)**

Описание:

Базовая модель - абстрактный класс для работы с данными.

Поля:

• constructor(data: Partial<T>, protected events: IEvents) - принимает данные для хранения/передачи и эвент эмиттер.

Методы:

• emitChanges(event: string, payload?: object) – вызывает эвент.

**4. BasketModel (Корзина)**

Описание:

Хранит и управляет товарами в корзине. Наследуется от abstract class Model<T>. При изменении данных в BasketModel (например, добавлении товара), BasketView обновляет интерфейс.

Поля:

• items: Map<string, { price: number}> – Map, где ключ – id товара

Методы:

• add(id: string) – добавляет товар в корзину

• remove(id: string) – удаляет товар

• setTotal(): number – возвращает общую сумму товаров в корзине.

• clearBasket() – очищает корзину.

• basketCounter() – возвращает количество товаров.

**6. CatalogModel (Каталог товаров)**

Описание:

Управляет списком товаров. Наследуется от abstract class Model<T>.

Поля:

• items: IProduct[] – массив товаров.

Методы:

• setItems(items: IProduct[]) – загружает список товаров.

• getProduct(id: string): IProduct – получает товар по id.

**7. OrderModel (Модель заказа)**

Описание:

Хранит данные о заказе и обновляет их. Включает информацию о способе оплаты, адресе доставки, контактных данных пользователя и списке товаров. Наследуется от abstract class Model<T>.

Поля:

• id: string – идентификатор заказа.

• total: number | null – сумма заказа.

• error?: string – ошибка (если есть).

• payment?: PaymentMethod – выбранный метод оплаты.

• address: string – адрес доставки.

• phone: number – номер телефона пользователя.

• email: string – email пользователя.

• items: string[] – список идентификаторов товаров в заказе.

Методы:

• validateContacts(): boolean – проверяет, заполнены ли телефон и email.

• validateOrder(): boolean – проверяет корректность заказа (адрес + контактные данные).

• setOrderField(field: keyof IOrderModel, value: string | number | PaymentMethod): void – обновляет указанное поле формы. Параметр field может быть одним из ключей интерфейса IOrderModel, а value – значением соответствующего типа.

## Слой Presenter

**9. EventEmitter (Брокер событий)**

Описание:

Класс EventEmitter управляет событиями, реализует паттерн "Observer" (Наблюдатель).

Поля:

• \_events: Map<EventName, Set<Subscriber>> – хранилище событий и подписчиков.

Методы:

• on(eventName: EventName, callback: (event: T) => void) – подписка на событие.

• off(eventName: EventName, callback: Subscriber) – удаление подписки.

• emit(eventName: string, data?: T) – уведомление подписчиков.

• onAll(callback: (event: EmitterEvent) => void) – подписка на все события.

• offAll() – удаление всех подписчиков.

• trigger(eventName: string, context?: Partial<T>) – генерирует событие с указанными параметрами.

## Слой View

**10. Component<T> (Базовый UI-компонент)**

Описание:

Абстрактный класс, который является базовым компонентом, служащим основой для всех UI-компонентов. Управляет взаимодействием с DOM и обновлением данных. Конструктор принимает один параметр - контейнер типа HTMLElement, в котором компонент будет рендериться.

Поля:

• events: IEvents (protected) – объект событий для управления подписками и отправкой событий.

Методы:

• toggleClass(element: HTMLElement, className: string, force?: boolean): void – добавляет или удаляет CSS-класс у элемента.

• setText(element: HTMLElement, value: unknown): void – устанавливает текстовое содержимое элемента.

• setDisabled(element: HTMLElement, state: boolean): void – блокирует или разблокирует элемент.

• setHidden(element: HTMLElement): void – скрывает элемент (display: none).

• setVisible(element: HTMLElement): void – показывает элемент.

• setImage(element: HTMLImageElement, src: string, alt?: string): void – устанавливает изображение для img.

• render(data?: Partial<T>): HTMLElement – абстрактный метод для рендеринга компонента (реализуется в наследниках).

**11. PageView (Представление страницы)**

Описание:

Управляет отображением карточек товаров и корзины. Получает данные о товарах через метод setItems и отображает их на странице. Наследуется от Component<T>.

Поля:

• basketCounter: HTMLElement – счетчик товаров в корзине.

• galleryContainer: HTMLElement – контейнер карточек.

• basketButton: HTMLElement – кнопка корзины.

Методы:

• basketCounter(): void – обновляет счетчик корзины, получая данные из модели корзины (BasketModel).

• renderCards(items: IProduct[]): void – отрисовывает товары на странице. Принимает массив товаров (items) и создает карточки для каждого товара.

**12. BasketView (Представление корзины)**

Описание:

Отвечает за отображение товаров в корзине. Получает данные о товарах в корзине через метод setItems и отображает их в модальном окне. Наследуется от Component<T>.

Поля:

• template: HTMLTemplateElement - Статическое поле, которое содержит HTML-шаблон корзины.
• list, total, checkoutButton: HTMLElement – элементы интерфейса.

Методы:
• constructor(container: HTMLElement, events: IEvents) - инициализирует компонент, связывая его с DOM-элементом (container) и объектом событий (events) для управления отображением и обработкой пользовательских действий.

• setTotal(): number – обновляет сумму товаров в корзине, получая данные из модели корзины (BasketModel).

• setItems(items: Map<string, { price: number }>): void – принимает данные о товарах в корзине и отображает их.

• render(): HTMLElement - отвечает за создание DOM-элемента (или его обновление) на основе текущего состояния данных.

• setCheckoutButtonState(enabled: boolean): void - Управляет состоянием кнопки "оформить заказ" (включает или выключает её)

**13. OrderView (Форма заказа Представление)**

Описание:

Отображает и обрабатывает форму заказа. Управляет вводом данных пользователя, таких как способ оплаты и адрес доставки. Пользователь вводит адрес вручную, а данные передаются в модель заказа (OrderModel). Наследуется от PopupView<T>.

Поля:

• payment: PaymentMethod – способ оплаты.

• address: HTMLElement – поле адреса.

• button: HTMLButtonElement – кнопка оформления заказа (Далее).

Методы:
• constructor(container: HTMLElement, events: IEvents) - инициализирует компонент, связывая его с DOM-элементом (container) и объектом событий (events) для управления отображением и обработкой пользовательских действий.

• setPaymentMethod(method: PaymentMethod): void – устанавливает способ оплаты, получая данные из модели заказа (OrderModel).

• setAddressValue(address: string): void – Устанавливает значение в поле адреса.

• setSubmitEnabled(state: boolean): void - Управляет состоянием кнопки Далее (активна/неактивна)

• showErrors(errors: string[]): void - Отображает переданные сообщения об ошибках

**14. PopupView<T> (Модальное окно Представление)**

Описание:

Абстрактный класс для всплывающих окон. Получает данные через метод render и отображает их в модальном окне. Наследуется от Component<T>.

Поля:

• closeButton: HTMLButtonElement (protected) – кнопка закрытия.

• content: HTMLElement (protected) – содержимое окна.

Методы:

• open(): void – открывает окно.

• close(): void – закрывает окно.

• render(data?: object): HTMLElement – отображает содержимое окна, принимая данные через параметр data.

**15. ContactsView (Форма контактов Представление)**

Описание:

Обрабатывает ввод телефона и email, которые пользователь вводит вручную. Управляет передачей этих данных в модель контактов (OrderModel). Наследуется от PopupView<T>.

Поля:

• phoneInput: HTMLInputElement – поле для ввода номера телефона.

• emailInput: HTMLInputElement – поле для ввода email.

• button: HTMLButtonElement – кнопка подтверждения ввода контактных данных (Далее).

Методы:

• constructor(container: HTMLElement, events: IEvents) - инициализирует компонент, связывая его с DOM-элементом (container) и объектом событий (events) для управления отображением и обработкой пользовательских действий. При изменении полей генерирует события:
contacts:phone-changed (с текущим значением), contacts:email-changed. При клике на кнопку - contacts:submit.

• setPhoneValue(value: string): void - Устанавливает отображаемое значение в поле телефона

• setEmailValue(value: string): void - Устанавливает отображаемое значение в поле email

• setSubmitEnabled(state: boolean): void - Управляет состоянием кнопки Далее (активна/неактивна)

• showErrors(errors: string[]): void - Отображает переданные сообщения об ошибках

**16. OrderResultView (Результат заказа Представление)**

Описание:

Отображает информацию о заказе. Наследуется от PopupView<T>.

Поля:

• id: HTMLElement – элемент для отображения идентификатора заказа.

• total: HTMLElement – элемент для отображения общей суммы заказа.

• error?: HTMLElement – элемент для отображения ошибки (если есть).

• button: HTMLElement – кнопка для возвращения на главный экран.

Методы:

• constructor(container: HTMLElement, events: IEvents)

• setTotal(): number – отображает сумму заказа, получает данные из OrderModel.

**17. CardView (Отображение карточки товара)**

Описание:

Отвечает за отображение товара в виде карточки. Карточка может иметь три представления: базовая страница, превью и полная карточка. В зависимости от типа представления, на карточке могут отображаться не все поля. Карточка создается из шаблона (template), а ее добавление в DOM управляется презентером. Наследуется от Component<T>.

Поля:

• title: HTMLElement – заголовок товара.

• image?: HTMLImageElement – изображение товара.

• price: HTMLElement – цена товара.

• description?: HTMLElement - описание товара (только для превью).

• category?: HTMLElement – категория товара.

• button?: HTMLButtonElement – кнопка добавления товара в корзину (только для превью).

• index?: HTMLElement - порядковый номер товара в корзине (только для корзины).

Методы:

• constructor(container: HTMLElement, actions?: ICardActions) - Инициализирует карточку товара, связывая её с DOM-элементом (container) и опциональными действиями (actions) для обработки кликов и других взаимодействий.

**18. type CardViewType = 'catalog' | 'preview' | 'basket' // как будет выглядеть карточка товара**

## Описание событий

"product:add-to-cart" Добавление товара в корзину

"product:remove-from-cart" Удаление товара из корзины

"cart:clear" Очистка корзины

"cart:update-counter" Обновление количества товаров в корзине

"cart:calculate-total" Пересчет суммы товаров в корзине

"order:submit" Отправка заказа

"order:success" Успешное оформление заказа

"order:error" Ошибка при оформлении заказа

"order:update-status" Обновление статуса заказа

"form:validate" Проверка валидности формы

"form:update" Обновление данных в форме заказа

"popup:open" Открытие всплывающего окна

"popup:close" Закрытие всплывающего окна

"contacts:update" Обновление контактных данных

"contacts:phone-changed" (с текущим значением) При изменении полей генерирует события

"contacts:email-changed" При изменении полей генерирует события

"contacts:submit" При клике на кнопку

"contacts:validate" Валидация контактной информации

"payment:select-method" Выбор метода оплаты

"page:render-products" Отрисовка товаров на странице

"page:render-cart" Отрисовка содержимого корзины

"modal:open" Открытие модального окна

"modal:close" Закрытие модального окна

## Описание Интерфейсов:

```
Управляет подпиской, вызовом и обработкой событий
```

interface **IEvents**
{
on<T extends object>(event: EventName, callback: (data: T) => void): void; //Добавляет подписчика (callback) на указанное событие (event)

    emit<T extends object>(event: string, data?: T): void; //Вызывает (emit) событие, передавая данные подписчикам

    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void; } //Создает коллбэк, который автоматически вызывает emit с заданными данными (context)

```
Интерфейс для работы с API WebLarek
```

Описывает методы взаимодействия с сервером WebLarek

interface **ILarekApi**
{
getProductList: () => Promise<IProduct[]>; //Загружает список товаров с сервера

getProduct: (id: string) => Promise<IProduct>; //Получает данные конкретного товара по id

orderProduct: (order: IOrder) => Promise<IOrderResult>; //Отправляет заказ на сервер и получает результат (IOrderResult)
}

```
Базовый интерфейс моделей данных
```

Описывает модель, которая может отправлять события при изменении данных

interface **IModel**<T>
{
emitChanges(event: string, payload?: object): void; //Отправляет (emit) событие при изменении данных в модели
}

```
Интерфейс корзины товаров
```

Определяет методы управления корзиной

interface **IBasketModel**
{
items: string[];

setTotal(): number; //Возвращает общую сумму товаров в корзине

}

```
Интерфейс формы контактных данных
```

Определяет структуру данных контактной информации пользователя

interface **IContactsForm**
{
payment?: PaymentMethod; //Выбранный способ оплаты

address: string; //Адрес доставки

phone: number; //Телефон пользователя

email: string; //Email пользователя
}

```
Интерфейс отображения корзины
```

Описывает структуру данных корзины

interface **IBasket**
{
list: HTMLElement[]; //Список товаров в корзине (DOM-элементы)

setTotal(): number; //Общая сумма товаров
}

```
Интерфейс карточки товара
```

Описывает структуру карточки товара на странице

interface **ICard**
{
title: string; //Название товара

image?: string; //Ссылка на изображение товара

description?: string; //Описание товара

category?: string; //Категория товара

price: number; //Цена товара

button?: HTMLButtonElement; //Кнопка добавления в корзину

renderProductItem(): void; //Рендер карточки товара в DOM
}

interface **ICardActions** {
onClick: (event: MouseEvent) => void; //Используется для обработки события клика на карточке товара
}

```
Интерфейс представления контактов
```

Описывает структуру данных и методы для работы с контактами пользователя

interface **IContactsView**
{
phone: number; // Номер телефона пользователя

email: string; // Электронная почта пользователя

setEmail(): void; // Метод для установки электронной почты

setPhoneNumber(): void; // Метод для установки номера телефона

setOrder(): void; // Метод для установки заказа
}

```
Интерфейс результата заказа
```

Описывает структуру данных, возвращаемых после оформления заказа

interface **IOrderResult**
{
id?: number; // Уникальный идентификатор заказа (опционально)

total: number; // Общая стоимость заказа

setTotalPrice(): void; // Метод для установки общей стоимости заказа
}

```
Интерфейс заказа
```

Описывает структуру данных заказа и методы для его управления

interface **IOrder**
{
payment?: PaymentMethod; // Способ оплаты (опционально)

email: string; // Электронная почта пользователя

phone: number; // Номер телефона пользователя

address: string; // Адрес доставки

items: string[]; // Список товаров в заказе

total: number; // Общая стоимость заказа

setPaymentMethod(): void; // Метод для установки способа оплаты

setAddress(): void; // Метод для установки адреса доставки
}

```
Интерфейс представления страницы
```

Описывает структуру данных и методы для отображения страницы с товарами

interface **IPageView**
{
items: IProduct[]; // Список товаров на странице

basketCounter(): void; // Метод для отображения счетчика корзины

renderCards(): void; // Метод для рендеринга карточек товаров
}

```
Интерфейс всплывающего окна
```

Описывает структуру данных и методы для работы с всплывающими окнами

interface **IPopup**
{
closeButton: HTMLButtonElement; // Кнопка закрытия всплывающего окна

content: string; // Содержимое всплывающего окна

open(): void; // Метод для открытия всплывающего окна

close(): void; // Метод для закрытия всплывающего окна

render(data: IPopup): HTMLElement; // Метод для рендеринга всплывающего окна
}

```
Интерфейс товара
```

Описывает структуру данных товара

interface **IProduct**
{
id: string; // Уникальный идентификатор товара

description: string; // Описание товара

image: string; // Ссылка на изображение товара

title: string; // Название товара

category: string; // Категория товара

price: number | null; // Цена товара (может быть null)
}

```
Интерфейс модели каталога
```

Описывает структуру данных и методы для работы с каталогом товаров

interface **ICatalogModel**
{
items: IProduct[]; // Список товаров в каталоге

setItems(items: IProduct[]): void; // Метод для установки списка товаров после загрузки API

getProduct(id: string): IProduct; // Метод для получения товара по идентификатору (используется при рендере списков)
}
