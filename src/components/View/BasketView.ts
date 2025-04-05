import { Component, View } from '../base/component';
import { ensureElement, cloneTemplate, createElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class BasketView extends View<IBasketView> {
	static template = ensureElement<HTMLTemplateElement>('#basket');

	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	items: HTMLElement[] = [];

	constructor(events: EventEmitter) {
		super(events, cloneTemplate(BasketView.template));
		console.log('Инициализация BasketView...');

		try {
			console.log('Поиск списка корзины...');
			this._list = ensureElement<HTMLElement>('.basket__list', this.container);
			console.log('Список корзины найден:', this._list.tagName);

			console.log('Поиск цены корзины...');
			this._total = ensureElement<HTMLElement>(
				'.basket__price',
				this.container
			);
			console.log('Цена корзины найдена:', this._total.tagName);

			console.log('Поиск кнопки корзины...');
			this._button = ensureElement<HTMLElement>('.button', this.container);
			console.log('Кнопка корзины найдена:', this._button.tagName);

			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});

			this.items = [];
			console.log('BasketView создан успешно');
		} catch (error) {
			console.error('Ошибка при инициализации BasketView:', error);
			throw error;
		}
	}

	setItems(items: HTMLElement[]) {
		try {
			if (items.length) {
				this._list.replaceChildren(...items);
				this._button.removeAttribute('disabled');
			} else {
				this._list.replaceChildren(
					createElement<HTMLParagraphElement>('p', {
						textContent: 'Корзина пуста',
					})
				);
				this._button.setAttribute('disabled', 'disabled');
			}
		} catch (error) {
			console.error('Ошибка при установке элементов корзины:', error);
			throw error;
		}
	}

	setTotal(total: number) {
		try {
			this.setText(this._total, `${total} синапсов`);
		} catch (error) {
			console.error('Ошибка при установке общей суммы:', error);
			throw error;
		}
	}
}
