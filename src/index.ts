import './scss/styles.scss';

import { LarekApi } from './components/Model/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import {
	PaymentMethod,
	CardViewType,
	IProduct,
	IBasketModel,
	ICatalogModel,
	ILarekApi,
	IOrderResult,
	IOrderModel,
	IOrder,
} from './types/index';

import { CardView } from './components/View/CardView';
import { PopupView } from './components/View/PopupView';
import { EventEmitter } from './components/base/events';
import { Model } from './components/base/Model';
import { BasketModel } from './components/Model/BasketModel';
import { CatalogModel } from './components/Model/CatalogModel';
import { OrderModel } from './components/Model/OrderModel';
import { PageView } from './components/View/PageView';
import { BasketView } from './components/View/BasketView';
import { OrderResultView } from './components/View/OrderResultView';
import { OrderView } from './components/View/OrderView';
import { ContactsView } from './components/View/ContactsView';
import { DynamicForm } from './components/View/FormView';

// Инициализация
const api = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();

// Модели
const basketModel = new BasketModel(events);
const catalogModel = new CatalogModel(events);
const orderModel = new OrderModel(events);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

// Представления
const basket = new BasketView(events);
const popup = new PopupView(
	events,
	ensureElement<HTMLElement>('#modal-container')
);
const page = new PageView(document.body, events);
const order = new OrderView(
	cloneTemplate(ensureElement<HTMLTemplateElement>('#order')),
	events
);
const contacts = new ContactsView(
	cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')),
	events
);

// Обработка оформления заказа
events.on('contacts:submit', () => {
	const orderData = {
		payment: orderModel.getData().payment,
		email: orderModel.getData().email,
		phone: Number(orderModel.getData().phone),
		address: orderModel.getData().address,
		items: basketModel.items.map((item) => item.id),
		total: basketModel.total,
	} as IOrder; // Явное приведение типа

	api
		.orderProduct(orderData)
		.then((result: IOrderResult) => {
			const successView = new OrderResultView(
				cloneTemplate(ensureElement<HTMLTemplateElement>('#success')),
				{
					onClick: () => {
						popup.close();
						basketModel.clear();
					},
				}
			);
			successView.total = result.total;
			popup.open(successView.render());
		})
		.catch((err: Error) => {
			console.error('Order submission error:', err);
			events.emit('order:error', err);
		});
});

// Форма заказа
events.on('order:open', () => {
	// Сбрасываем состояние модели заказа
	orderModel.reset();

	const orderForm = new OrderView(
		cloneTemplate(ensureElement<HTMLTemplateElement>('#order')),
		events
	);

	// При первом открытии формы не показываем ошибки, но кнопка неактивна
	orderForm.isValid = false;
	orderForm.errorMessages = [];

	popup.open(orderForm.render());
});

events.on('order:submit', () => {
	// Проверяем только поля адреса и способа оплаты
	const orderData = orderModel.getData();
	const isValid = orderData.payment && orderData.address.length >= 1;

	if (isValid) {
		const contactsForm = new ContactsView(
			cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')),
			events
		);

		contactsForm.email = orderData.email;
		contactsForm.phone = orderData.phone;
		contactsForm.isValid = true;
		contactsForm.errorMessages = [];

		popup.open(contactsForm.render());
	}
});

// Обновление данных заказа
events.on(
	'order:field-update',
	(data: { field: 'payment' | 'address'; value: string }) => {
		if (data.field === 'payment') {
			orderModel.setPayment(data.value as PaymentMethod);
		} else {
			orderModel.setAddress(data.value);
		}
		// Вызываем валидацию после каждого изменения поля
		events.emit('order:validate');
	}
);

// Добавляем обработчик события order:validate

/* events.on('order:validate', () => {
	const orderData = orderModel.getData();
	const orderForm = document.querySelector(
		'.modal__content form[name="order"]'
	);
	if (!orderForm) return;

	// Проверяем, был ли `blur` на адресе
	const orderView = orderForm as unknown as OrderView;
	const isAddressValid = orderView.isAddressTouched
		? orderData.address.trim().length > 0
		: true; // Если поле не трогали, считаем валидным

	const isValid = orderData.payment && isAddressValid;

	// Обновляем состояние кнопки
	const submitButton = orderForm.querySelector<HTMLButtonElement>(
		'button[type="submit"]'
	);
	if (submitButton) {
		submitButton.disabled = !isValid;
	} */

/* 	// Сообщения об ошибках только если поле заполнялось
	const errorContainer = orderForm.querySelector('.form__errors');
	if (errorContainer) {
		const errors = orderModel.getErrors();
		const filteredErrors = orderView.isAddressTouched
			? Object.values(errors).filter(Boolean)
			: [];

		errorContainer.textContent = filteredErrors.join(', ');
	}
}); */

// Обновление данных контактов
events.on(
	'contacts:field-update',
	(data: { field: 'email' | 'phone'; value: string }) => {
		if (data.field === 'email') {
			orderModel.setEmail(data.value);
		} else {
			orderModel.setPhone(data.value);
		}
	}
);

// Добавляем обработчик события contacts:validate
events.on('contacts:validate', () => {
	const orderData = orderModel.getData();
	const isValid = orderData.email && orderData.phone;

	// Обновляем состояние кнопки и сообщения об ошибках
	const contactsForm = document.querySelector(
		'.modal__content form[name="contacts"]'
	);
	if (contactsForm) {
		const submitButton = contactsForm.querySelector<HTMLButtonElement>(
			'button[type="submit"]'
		);
		if (submitButton) {
			submitButton.disabled = !isValid;
		}

		const errorContainer = contactsForm.querySelector('.form__errors');
		if (errorContainer) {
			const errors = orderModel.getErrors();
			// Фильтруем ошибки, оставляя только те, что относятся к форме контактов
			const contactErrors = {
				email: errors.email,
				phone: errors.phone,
			};
			errorContainer.textContent = Object.values(contactErrors)
				.filter(Boolean)
				.join(', ');
		}
	}
});

// Добавляем обработчик события contacts:submit для отправки заказа
events.on('contacts:submit', () => {
	const orderData = orderModel.getData();
	if (orderData.email && orderData.phone) {
		// Здесь можно добавить логику отправки заказа
		console.log('Заказ отправлен:', orderData);

		// Показываем сообщение об успешном заказе
		const successView = new OrderResultView(
			cloneTemplate(ensureElement<HTMLTemplateElement>('#success')),
			{
				onClick: () => {
					popup.close();
					basketModel.clear();
				},
			}
		);
		successView.total = orderData.total;
		popup.open(successView.render());
	}
});

// Корзина
events.on('basket:open', () => {
	const basketView = new BasketView(events);

	function updateBasket() {
		const items = basketModel.items.map((item, index) => {
			const card = new CardView(cloneTemplate(cardBasketTemplate), {
				onClick: () => {
					basketModel.remove(item.id);
					updateBasket();
				},
			});
			card.index = index + 1;
			card.title = item.title;
			card.price = item.price ?? 0;
			return card.render();
		});
		basketView.setItems(items);
		basketView.setTotal(basketModel.total);
	}

	updateBasket();
	popup.open(basketView.render());
});

events.on('basket:changed', () => {
	page.setCounter(basketModel.items.length);
	orderModel.setItems(basketModel.items.map((item) => item.id));
	orderModel.setTotal(basketModel.total);
});

// Каталог товаров
events.on('items:changed', (items: IProduct[]) => {
	console.log('Изменения в каталоге:', items);
	try {
		if (!Array.isArray(items)) {
			console.error('Данные каталога не являются массивом:', items);
			return;
		}

		const catalogItems = items.map((item: IProduct) => {
			const card = new CardView(cloneTemplate(cardCatalogTemplate), {
				onClick: () => events.emit('card:select', item),
			});
			card.id = item.id;
			card.title = item.title;
			card.image = item.image;
			card.category = item.category;
			card.price = item.price ?? 0;
			card.toggle('catalog');
			return card.render();
		});

		page.setCatalog(catalogItems);
	} catch (error) {
		console.error('Ошибка при обработке каталога:', error);
	}
});

// Просмотр карточки
events.on('card:select', (item: IProduct) => {
	const card = new CardView(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (basketModel.items.some((i) => i.id === item.id)) {
				basketModel.remove(item.id);
			} else {
				basketModel.add(item);
			}
			card.button = basketModel.items.some((i) => i.id === item.id)
				? 'Удалить из корзины'
				: 'В корзину';
			const newCard = card.render();
			const currentCard = document.querySelector('.modal__content');
			if (currentCard) {
				currentCard.innerHTML = '';
				currentCard.appendChild(newCard);
			}
		},
	});

	card.id = item.id;
	card.title = item.title;
	card.image = item.image;
	card.category = item.category;
	card.price = item.price ?? 0;
	card.description = item.description ?? '';
	card.button = basketModel.items.some((i) => i.id === item.id)
		? 'Удалить из корзины'
		: 'В корзину';
	card.toggle('preview');

	popup.open(card.render());
});

// Модальные окна
events.on('popup:open', () => {
	page.setLocked(true);
});

events.on('popup:close', () => {
	page.setLocked(false);
});

// Инициализация приложения
api
	.getProductList()
	.then((items: IProduct[]) => {
		catalogModel.setItems(items);
		events.emit('basket:changed');
	})
	.catch((err: Error) => {
		console.error('Failed to load products:', err);
		events.emit('items:error', err);
	});

document.addEventListener('DOMContentLoaded', () => {
	const activeModal = document.querySelector('.modal_active');
	if (activeModal) {
		activeModal.classList.remove('modal_active');
	}
});
