import { View } from '../base/component';
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

		try {
			this._list = ensureElement<HTMLElement>('.basket__list', this.container);

			this._total = ensureElement<HTMLElement>(
				'.basket__price',
				this.container
			);

			this._button = ensureElement<HTMLElement>('.button', this.container);

			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});

			this.items = [];
		} catch (error) {
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
			throw error;
		}
	}

	setTotal(total: number) {
		try {
			this.setText(this._total, `${total} синапсов`);
		} catch (error) {
			throw error;
		}
	}
}
