import { View } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export interface IPage {
	basketCounter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class PageView extends View<IPage> {
	protected _basketCounter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(events, container);

		this._basketCounter = ensureElement<HTMLElement>(
			'.header__basket-counter',
			container
		);
		this._catalog = ensureElement<HTMLElement>('.gallery', container);
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);
		this._basket = ensureElement<HTMLElement>('.header__basket', container);

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	setCounter(value: number) {
		this.setText(this._basketCounter, String(value));
	}

	setCatalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	setLocked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}

	protected setText(element: HTMLElement, value: string): void {
		if (element) {
			element.textContent = value;
		}
	}
}
