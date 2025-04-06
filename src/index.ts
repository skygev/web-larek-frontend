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
import { enableValidation, clearInputFields } from './components/validation';

// Конфигурация валидации
const validationConfig = {
	formSelector: '.form',
	inputSelector: '.form__input',
	submitButtonSelector: '.button[type="submit"]',
	inactiveButtonClass: 'button_disabled',
	inputErrorClass: 'form__input_error',
	errorActiveClass: 'form__error_visible',
};

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

// Включаем валидацию форм
enableValidation(validationConfig);

// Контакты
events.on('contacts:submit', () => {
	const orderData = orderModel.getData();
	if (orderData.email && orderData.phone) {
		api
			.orderProduct({
				payment: orderData.payment,
				email: orderData.email,
				phone: orderData.phone,
				address: orderData.address,
				items: basketModel.items.map((item) => item.id),
				total: basketModel.total,
			} as IOrder)
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
				contacts.errorMessages = ['Ошибка при оформлении заказа'];
			});
	}
});

// Форма заказа
events.on('order:open', () => {
	order.resetForm();
	popup.open(order.render());
});

events.on(
	'order:submit',
	(data: { payment: PaymentMethod; address: string }) => {
		// Сохраняем данные в модель
		orderModel.setPayment(data.payment);
		orderModel.setAddress(data.address);

		// Открываем форму контактов
		const contactsForm = contacts.render();
		popup.open(contactsForm);
	}
);

// Обновление данных заказа
events.on(
	'order:field-update',
	(data: { field: 'payment' | 'address'; value: string }) => {
		if (data.field === 'payment') {
			orderModel.setPayment(data.value as PaymentMethod);
		} else {
			orderModel.setAddress(data.value);
		}
	}
);

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
			popup.open(card.render());
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
	});

document.addEventListener('DOMContentLoaded', () => {
	const activeModal = document.querySelector('.modal_active');
	if (activeModal) {
		activeModal.classList.remove('modal_active');
	}
});
