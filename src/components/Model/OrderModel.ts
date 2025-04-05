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

	validate(): boolean {
		this._errors = {};

		// Проверяем только поля, относящиеся к текущему этапу
		if (!this._payment) {
			this._errors.payment = 'Необходимо выбрать способ оплаты';
		}

		// Проверяем адрес только если пользователь начал его вводить
		if (this._addressStarted && this._address.trim().length === 0) {
			this._errors.address = 'Необходимо указать адрес';
		}

		// Проверяем email и телефон только если пользователь начал их вводить
		if (this._email.length > 0 && !this._email) {
			this._errors.email = 'Необходимо указать email';
		}

		if (this._phone.length > 0 && !this._phone) {
			this._errors.phone = 'Необходимо указать телефон';
		}

		this.emitChanges('formErrors:changed', { errors: this._errors });
		return Object.keys(this._errors).length === 0;
	}

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

	clearErrors(): void {
		this._errors = {};
		this.emitChanges('formErrors:changed', { errors: this._errors });
	}

	reset(): void {
		this._payment = null;
		this._address = '';
		this._email = '';
		this._phone = '';
		this._errors = {};
		this._addressStarted = false; // Сбрасываем флаг при сбросе модели
		this.emitChanges('order:changed');
		this.emitChanges('formErrors:changed', { errors: this._errors });
	}
}
