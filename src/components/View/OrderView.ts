import { PaymentMethod, OrderForm } from '../../types';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { DynamicForm } from './FormView';

export class OrderView extends DynamicForm<OrderForm> {
	protected _paymentCard: HTMLButtonElement;
	protected _paymentCash: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;
	protected touchedFields: Set<string> = new Set();

	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container, events);

		this._paymentCard = ensureElement<HTMLButtonElement>(
			'.button_alt[name=card]',
			this.container
		);
		this._paymentCash = ensureElement<HTMLButtonElement>(
			'.button_alt[name=cash]',
			this.container
		);
		this._addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.container
		);

		this.setupHandlers();
	}

	private setupHandlers(): void {
		this._paymentCard.addEventListener('click', () => {
			this.events.emit('order:payment:change', { method: 'card' });
		});

		this._paymentCash.addEventListener('click', () => {
			this.events.emit('order:payment:change', { method: 'cash' });
		});

		this._addressInput.addEventListener('input', () => {
			this.touchedFields.add('address');
			this.events.emit('order:address:change', {
				value: this._addressInput.value,
			});
		});

		this._addressInput.addEventListener('focus', () => {
			this.touchedFields.add('address');
			this.events.emit('order:address:start');
		});

		this.container.addEventListener('submit', (event: SubmitEvent) => {
			event.preventDefault();
			this.events.emit('order:submit');
		});
	}

	updateFormState(isValid: boolean, errors: Record<string, string>): void {
		this.isValid = isValid;

		if (errors.address) {
			this._addressInput.classList.add('form__input_error');
		} else {
			this._addressInput.classList.remove('form__input_error');
		}

		this.errorMessages = Object.values(errors);
	}

	set payment(value: PaymentMethod) {
		this._paymentCard.classList.toggle('button_alt-active', value === 'card');
		this._paymentCash.classList.toggle('button_alt-active', value === 'cash');
	}

	resetForm(): void {
		super.resetForm();
		this._paymentCard.classList.remove('button_alt-active');
		this._paymentCash.classList.remove('button_alt-active');
		this._addressInput.value = '';
		this.touchedFields.clear();
	}
}
