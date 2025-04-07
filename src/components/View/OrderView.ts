import { PaymentMethod, OrderForm } from '../../types';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { DynamicForm } from './FormView';

export class OrderView extends DynamicForm<OrderForm> {
	protected _paymentCard: HTMLButtonElement;
	protected _paymentCash: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;

	private _handleFirstAddressInput = () => {
		this.events.emit('order:address-started');
		this._addressInput.removeEventListener(
			'input',
			this._handleFirstAddressInput
		);
	};

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

		// Изначально форма невалидна
		this.isValid = false;
	}

	private setupHandlers(): void {
		// Кнопки выбора способа оплаты
		this._paymentCard.addEventListener('click', () => {
			this.payment = 'card';
			this.onInputChange('payment', 'card');
		});

		this._paymentCash.addEventListener('click', () => {
			this.payment = 'cash';
			this.onInputChange('payment', 'cash');
		});

		// Основной обработчик ввода адреса
		this._addressInput.addEventListener('input', () => {
			console.log('[OrderView] Address input:', this._addressInput.value);
			this.onInputChange('address', this._addressInput.value);
		});

		// Первый ввод в поле адреса → включаем валидацию
		this._addressInput.addEventListener('input', this._handleFirstAddressInput);
	}

	set payment(value: PaymentMethod) {
		this._paymentCard.classList.toggle('button_alt-active', value === 'card');
		this._paymentCash.classList.toggle('button_alt-active', value === 'cash');
	}

	set address(value: string) {
		this._addressInput.value = value;
	}

	resetForm(): void {
		super.resetForm();
		this._paymentCard.classList.remove('button_alt-active');
		this._paymentCash.classList.remove('button_alt-active');
		this._addressInput.value = '';

		// Повторно навешиваем слушатель "первого ввода" при сбросе формы
		this._addressInput.removeEventListener(
			'input',
			this._handleFirstAddressInput
		); // на всякий случай
		this._addressInput.addEventListener('input', this._handleFirstAddressInput);
	}
}
