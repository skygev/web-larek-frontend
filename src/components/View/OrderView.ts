import { PaymentMethod, OrderForm } from '../../types';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { DynamicForm } from './FormView';

export class OrderView extends DynamicForm<OrderForm> {
	protected _paymentCard: HTMLButtonElement;
	protected _paymentCash: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;
	protected _submitButton: HTMLButtonElement;

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
		this._submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			this.container
		);

		// Блокируем кнопку при инициализации
		this._submitButton.disabled = true;

		this._paymentCard.addEventListener('click', () => {
			this.payment = 'card';
			this.validateForm();
		});

		this._paymentCash.addEventListener('click', () => {
			this.payment = 'cash';
			this.validateForm();
		});

		this._addressInput.addEventListener('input', () => {
			this.validateForm();
		});
	}

	private validateForm(): void {
		const isAddressValid = this._addressInput.value.trim().length > 0;
		const isPaymentValid = !!this.payment;

		this._submitButton.disabled = !(isAddressValid && isPaymentValid);
	}

	set address(value: string) {
		this._addressInput.value = value;
		this.validateForm();
	}

	set payment(value: PaymentMethod) {
		this._paymentCard.classList.toggle('button_alt-active', value === 'card');
		this._paymentCash.classList.toggle('button_alt-active', value === 'cash');
		this.validateForm();
	}

	get payment(): PaymentMethod | null {
		if (this._paymentCard.classList.contains('button_alt-active'))
			return 'card';
		if (this._paymentCash.classList.contains('button_alt-active'))
			return 'cash';
		return null;
	}
}
