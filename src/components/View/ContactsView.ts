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
			this.events.emit('contacts:email:change', {
				value: this._emailInput.value,
			});
		});

		this._phoneInput.addEventListener('input', () => {
			this.events.emit('contacts:phone:change', {
				value: this._phoneInput.value,
			});
		});

		this.container.addEventListener('submit', (event: SubmitEvent) => {
			event.preventDefault();
			this.events.emit('contacts:submit');
		});
	}

	updateFormState(isValid: boolean, errors: Record<string, string>): void {
		this.isValid = isValid;

		if (errors.email) {
			this._emailInput.classList.add('form__input_error');
		} else {
			this._emailInput.classList.remove('form__input_error');
		}

		if (errors.phone) {
			this._phoneInput.classList.add('form__input_error');
		} else {
			this._phoneInput.classList.remove('form__input_error');
		}

		this.errorMessages = Object.values(errors);
	}

	resetForm(): void {
		super.resetForm();
		this._emailInput.value = '';
		this._phoneInput.value = '';
	}
}
