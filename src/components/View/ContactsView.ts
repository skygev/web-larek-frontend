import { DynamicForm } from './FormView';
import { OrderForm } from '../../types';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';

export class ContactsView extends DynamicForm<OrderForm> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;
	protected _submitButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container, events);

		this._emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			this.container
		);
		this._phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			this.container
		);
		this._submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			this.container
		);

		// Блокируем кнопку при инициализации
		this._submitButton.disabled = true;

		this._emailInput.addEventListener('input', () => {
			this.validateContacts();
		});

		this._phoneInput.addEventListener('input', () => {
			this.validateContacts();
		});
	}

	private validateContacts(): void {
		const isEmailValid = this._emailInput.validity.valid;
		const isPhoneValid = this._phoneInput.validity.valid;

		this._submitButton.disabled = !(isEmailValid && isPhoneValid);
	}

	set email(value: string) {
		this._emailInput.value = value;
		this.validateContacts();
	}

	set phone(value: string) {
		this._phoneInput.value = value;
		this.validateContacts();
	}
}
