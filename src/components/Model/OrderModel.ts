import { Model } from '../base/Model';
import { IOrderModel, PaymentMethod } from '../../types';

export class OrderModel extends Model<IOrderModel> {
	private _payment: PaymentMethod | null = null;
	private _address: string = '';
	private _email: string = '';
	private _phone: string = '';
	private _items: string[] = [];
	private _total: number = 0;
	private _errors: Partial<Record<keyof IOrderModel, string>> = {};
	private _addressStarted: boolean = false;
	private _emailStarted: boolean = false;
	private _phoneStarted: boolean = false;

	setPayment(method: PaymentMethod): void {
		this._payment = method;
		this.validate();
		this.emitChanges('order:changed');
	}

	setAddress(address: string): void {
		this._address = address;
		this.validate();
		this.emitChanges('order:changed');
	}

	setEmail(email: string): void {
		this._email = email;
		this.validate();
		this.emitChanges('order:changed');
	}

	setPhone(phone: string): void {
		this._phone = phone;
		this.validate();
		this.emitChanges('order:changed');
	}

	setItems(items: string[]): void {
		this._items = items;
		this.emitChanges('order:changed');
	}

	setTotal(total: number): void {
		this._total = total;
		this.emitChanges('order:changed');
	}

	// Validation methods
	validate(): boolean {
		this._errors = {};

		// Payment validation
		if (!this._payment) {
			this._errors.payment = 'Необходимо выбрать способ оплаты';
		}

		// Address validation (only if started)
		if (this._addressStarted && !this._address.trim()) {
			this._errors.address = 'Необходимо указать адрес';
		}

		// Email validation (only if started)
		if (this._emailStarted) {
			if (!this._email.trim()) {
				this._errors.email = 'Необходимо указать email';
			} else if (!this.validateEmail(this._email)) {
				this._errors.email = 'Некорректный email';
			}
		}

		// Phone validation (only if started)
		if (this._phoneStarted) {
			if (!this._phone.trim()) {
				this._errors.phone = 'Необходимо указать телефон';
			} else if (!this.validatePhone(this._phone)) {
				this._errors.phone = 'Некорректный телефон';
			}
		}

		this.emitChanges('formErrors:changed', { errors: this._errors });
		return Object.keys(this._errors).length === 0;
	}

	// Track field interactions
	startAddressInput(): void {
		this._addressStarted = true;
		this.validate();
	}

	startEmailInput(): void {
		this._emailStarted = true;
		this.validate();
	}

	startPhoneInput(): void {
		this._phoneStarted = true;
		this.validate();
	}

	// Helper validation methods
	private validateEmail(email: string): boolean {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	}

	private validatePhone(phone: string): boolean {
		const re = /^\+?[\d\s\-\(\)]{7,}$/;
		return re.test(phone);
	}

	// Getters
	getData(): IOrderModel {
		return {
			payment: this._payment,
			address: this._address,
			email: this._email,
			phone: this._phone,
			items: this._items,
			total: this._total,
		};
	}

	getErrors(): Partial<Record<keyof IOrderModel, string>> {
		return this._errors;
	}

	reset(): void {
		this._payment = null;
		this._address = '';
		this._email = '';
		this._phone = '';
		this._errors = {};
		this._addressStarted = false;
		this._emailStarted = false;
		this._phoneStarted = false;
		this.emitChanges('order:changed');
	}
}
