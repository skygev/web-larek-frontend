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

	protected categoryModifiers: Record<string, string> = {
		soft: 'card__category_soft',
		hard: 'card__category_hard',
		other: 'card__category_other',
		additional: 'card__category_additional',
		button: 'card__category_button',
	};

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = container.querySelector('.card__image') || undefined;
		this._category = container.querySelector('.card__category') || undefined;
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button') || undefined;
		this._description =
			container.querySelector('.card__description') || undefined;
		this._index = container.querySelector('.basket__item-index') || undefined;

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

	set id(value: string) {
		if (value) {
			this.container.dataset.id = value.trim();
		}
	}

	get id(): string {
		return this.container.dataset.id ?? '';
	}

	set title(value: string) {
		this._title && this.setText(this._title, value.trim());
	}

	get title(): string {
		return this._title?.textContent?.trim() ?? '';
	}

	set price(value: number) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (this._button) {
			this._button.disabled = !value;
		}
	}

	set category(value: string) {
		if (this._category) {
			// Очищаем старые классы
			Object.values(this.categoryModifiers).forEach((mod) =>
				this._category!.classList.remove(mod)
			);

			// Получаем ключ из значения
			const categoryKey = this.getCategoryKey(value);
			const className = this.categoryModifiers[categoryKey];

			if (className) {
				this._category.classList.add(className);
			}

			this.setText(this._category, value);
		}
	}

	private getCategoryKey(value: string): string {
		const reverseMap: Record<string, string> = {
			'софт-скил': 'soft',
			'хард-скил': 'hard',
			другое: 'other',
			дополнительно: 'additional',
			'по кнопке': 'button',
		};

		return reverseMap[value.toLowerCase()] || 'other';
	}

	set image(value: string) {
		if (this._image) {
			this.setImage(this._image, value, this.title || 'Без названия');
		}
	}

	set description(value: string) {
		if (this._description) {
			this.setText(this._description, value);
		}
	}

	set button(value: string) {
		if (this._button) {
			this.setText(this._button, value);
		}
	}

	set index(value: number) {
		if (this._index) {
			this.setText(this._index, `${value}`);
		}
	}
}
