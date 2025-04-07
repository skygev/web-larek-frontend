import { Model } from '../base/Model';
import { IOrderModel, PaymentMethod } from '../../types';
import { IOrder } from '../../types';

export class OrderModel extends Model<IOrderModel> {
	private _payment: PaymentMethod | null = null;
	private _address: string = '';
	private _email: string = '';
	private _phone: string = '';
	private _errors: Partial<Record<keyof IOrderModel, string>> = {};
	private _addressStarted: boolean = false;

	private _emailTouched: boolean = false;
	private _phoneTouched: boolean = false;

	setPayment(method: PaymentMethod): void {
		this._payment = method;
		this.validateOrderForm();
		this.emitChanges('order:changed');
	}

	setAddress(address: string): void {
		this._address = address;
		this.validateOrderForm();
		this.emitChanges('order:changed');
	}

	setEmail(email: string): void {
		this._email = email;
		this._emailTouched = true;
		this.validateContactsForm();
		this.emitChanges('order:changed');
	}

	setPhone(phone: string): void {
		this._phone = phone;
		this._phoneTouched = true;
		this.validateContactsForm();
		this.emitChanges('order:changed');
	}

	// Метод для активации валидации адреса
	startAddressValidation(): void {
		if (!this._addressStarted) {
			this._addressStarted = true;
			this.validateOrderForm();
		}
	}

	private validateOrderForm(): boolean {
		this._errors = {};

		if (!this._payment) {
			this._errors.payment = 'Необходимо выбрать способ оплаты';
		}

		if (this._addressStarted && !this._address.trim()) {
			this._errors.address = 'Необходимо указать адрес';
		}

		const isValid =
			Boolean(this._payment) &&
			(this._addressStarted ? Boolean(this._address.trim()) : false);

		this.emitChanges('orderForm:valid', { isValid });
		this.emitChanges('formErrors:changed', { errors: this._errors });

		return isValid;
	}

	private validateContactsForm(): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex = /^\+?[\d\s\-\(\)]{7,}$/;

		if (this._emailTouched) {
			if (!this._email.trim()) {
				this._errors.email = 'Необходимо указать email';
			} else if (!emailRegex.test(this._email)) {
				this._errors.email = 'Некорректный email';
			} else {
				delete this._errors.email;
			}
		}

		if (this._phoneTouched) {
			if (!this._phone.trim()) {
				this._errors.phone = 'Необходимо указать телефон';
			} else if (!phoneRegex.test(this._phone)) {
				this._errors.phone = 'Некорректный телефон';
			} else {
				delete this._errors.phone;
			}
		}

		const isValid =
			emailRegex.test(this._email) && phoneRegex.test(this._phone);

		this.emitChanges('contactsForm:valid', { isValid });
		this.emitChanges('formErrors:changed', { errors: this._errors });

		return isValid;
	}

	// Метод теперь принимает items и total извне (например, из BasketModel)
	composeOrderData(items: string[], total: number): IOrder {
		return {
			payment: this._payment ?? undefined,
			address: this._address,
			email: this._email,
			phone: this._phone,
			items,
			total,
		};
	}

	getData(): IOrderModel {
		// Возвращаем частичные данные (без basket-части)
		return {
			payment: this._payment!,
			address: this._address,
			email: this._email,
			phone: this._phone,
			items: [],
			total: 0,
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
		this._emailTouched = false;
		this._phoneTouched = false;
		this.emitChanges('order:changed');
	}
}
