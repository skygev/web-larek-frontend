import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { Component, View } from '../base/component';

interface IPopup {
	content: HTMLElement | string; // Контент модального окна (DOM-элемент или HTML-строка)
}

export class PopupView extends View<HTMLElement> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(events: IEvents, container: HTMLElement) {
		super(events, container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement | string) {
		if (typeof value === 'string') {
			this._content.innerHTML = value;
		} else {
			this._content.replaceChildren(value);
		}
	}

	open(content?: HTMLElement | string) {
		if (content) {
			this.content = content;
		}
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this._content.innerHTML = '';
		this.events.emit('popup:close');
	}

	render(data: Partial<HTMLElement> & IPopup): HTMLElement {
		super.render(data);
		if (data.content) {
			this.content = data.content;
		}
		this.open();
		return this.container;
	}
}
