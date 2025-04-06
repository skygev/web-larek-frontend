import { OrderForm } from '../../types';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { DynamicForm } from './FormView';

export class ContactsView extends DynamicForm<OrderForm> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;

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

		this.setupHandlers();
	}

	private setupHandlers(): void {
		this._emailInput.addEventListener('input', () => {
			this.onInputChange('email', this._emailInput.value);
		});

		this._phoneInput.addEventListener('input', () => {
			this.onInputChange('phone', this._phoneInput.value);
		});
	}

	set email(value: string) {
		this._emailInput.value = value;
	}

	set phone(value: string) {
		this._phoneInput.value = value;
	}

	resetForm(): void {
		super.resetForm();
		this._emailInput.value = '';
		this._phoneInput.value = '';
	}
}
