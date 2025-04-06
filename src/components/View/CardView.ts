import { Component } from '../base/component';
import { CardViewType } from '../../types';
import { ensureElement } from '../../utils/utils';

interface ICard {
	title: string;
	image?: string;
	category?: string;
	price: number;
	button?: string;
	description?: string;
	index?: number;
	renderProductItem(): void;
}

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class CardView extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _description?: HTMLElement;
	protected _index?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		// Инициализация элементов
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = container.querySelector('.card__image') || undefined;
		this._category = container.querySelector('.card__category') || undefined;
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button') || undefined;
		this._description =
			container.querySelector('.card__description') || undefined;
		this._index = container.querySelector('.basket__item-index') || undefined;

		// Настройка обработчиков событий
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	toggle(modifier: CardViewType) {
		const viewTypes: CardViewType[] = ['catalog', 'preview', 'basket'];

		viewTypes.forEach((type) =>
			this.container.classList.remove(`card--${type}`)
		);

		this.container.classList.add(`card--${modifier}`);
	}

	// Сеттер и геттер для ID
	set id(value: string) {
		if (value) {
			this.container.dataset.id = value.trim();
		}
	}

	get id(): string {
		return this.container.dataset.id ?? '';
	}

	// Сеттер и геттер для Title
	set title(value: string) {
		this._title && this.setText(this._title, value.trim());
	}

	get title(): string {
		return this._title?.textContent?.trim() ?? '';
	}

	// Сеттер для Price
	set price(value: number) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (this._button) {
			this._button.disabled = !value;
		}
	}

	// Сеттер для Category
	set category(value: string) {
		this.setText(this._category, value);
	}

	// Сеттер для Image
	set image(value: string) {
		if (this._image) {
			this.setImage(this._image, value, this.title || 'Без названия');
		}
	}

	// Сеттер для Description
	set description(value: string) {
		if (this._description) {
			this.setText(this._description, value);
		}
	}

	// Сеттер для Button
	set button(value: string) {
		if (this._button) {
			this.setText(this._button, value);
		}
	}

	// Сеттер для Index
	set index(value: number) {
		if (this._index) {
			this.setText(this._index, `${value}`);
		}
	}
}
