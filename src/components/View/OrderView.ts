import { PaymentMethod, OrderForm } from '../../types';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { DynamicForm } from './FormView';

export class OrderView extends DynamicForm<OrderForm> {
	protected _paymentCard: HTMLButtonElement;
	protected _paymentCash: HTMLButtonElement;

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

		this._paymentCard.addEventListener('click', () => {
			this.payment = 'card';
			this.handleFieldUpdate('payment', 'card');
		});

		this._paymentCash.addEventListener('click', () => {
			this.payment = 'cash';
			this.handleFieldUpdate('payment', 'cash');
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set payment(value: PaymentMethod) {
		this._paymentCard.classList.toggle('button_alt-active', value === 'card');
		this._paymentCash.classList.toggle('button_alt-active', value === 'cash');
	}
}
