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

	private _emailTouched: boolean = false;
	private _phoneTouched: boolean = false;

	setPayment(method: PaymentMethod): void {
		console.log('Setting payment:', method);
		this._payment = method;
		this.validateOrderForm();
		this.emitChanges('order:changed');
	}

	setAddress(address: string): void {
		console.log('Setting address:', address);
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

	setItems(items: string[]): void {
		this._items = items;
		this.emitChanges('order:changed');
	}

	setTotal(total: number): void {
		this._total = total;
		this.emitChanges('order:changed');
	}

	// Метод для активации валидации адреса
	startAddressValidation(): void {
		console.log('Address validation started');
		if (!this._addressStarted) {
			this._addressStarted = true;
			this.validateOrderForm();
		}
	}

	private validateOrderForm(): boolean {
		this._errors = {};

		// Проверка способа оплаты
		if (!this._payment) {
			this._errors.payment = 'Необходимо выбрать способ оплаты';
		}

		// Проверка адреса — только если начали ввод
		if (this._addressStarted) {
			if (!this._address.trim()) {
				this._errors.address = 'Необходимо указать адрес';
			}
		}

		// Валидность: способ оплаты выбран и (адрес начали вводить и он не пустой)
		const isValid =
			Boolean(this._payment) &&
			(this._addressStarted ? Boolean(this._address.trim()) : false);

		console.log('Order validation result:', isValid, 'Errors:', this._errors);

		this.emitChanges('orderForm:valid', { isValid });
		this.emitChanges('formErrors:changed', {
			errors: this._errors,
		});

		return isValid;
	}

	private validateContactsForm(): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex = /^\+?[\d\s\-\(\)]{7,}$/;

		console.log('--- Запуск валидации контактов ---');
		console.log('Текущий email:', this._email);
		console.log('Текущий phone:', this._phone);
		console.log('emailTouched:', this._emailTouched);
		console.log('phoneTouched:', this._phoneTouched);

		// Email
		if (this._emailTouched) {
			if (!this._email.trim()) {
				this._errors.email = 'Необходимо указать email';
				console.log('Ошибка email: поле пустое');
			} else if (!emailRegex.test(this._email)) {
				this._errors.email = 'Некорректный email';
				console.log('Ошибка email: не прошёл regex');
			} else {
				delete this._errors.email;
				console.log('Email валиден');
			}
		}

		// Phone
		if (this._phoneTouched) {
			if (!this._phone.trim()) {
				this._errors.phone = 'Необходимо указать телефон';
				console.log('Ошибка phone: поле пустое');
			} else if (!phoneRegex.test(this._phone)) {
				this._errors.phone = 'Некорректный телефон';
				console.log('Ошибка phone: не прошёл regex');
			} else {
				delete this._errors.phone;
				console.log('Телефон валиден');
			}
		}

		const isValid =
			emailRegex.test(this._email) && phoneRegex.test(this._phone);
		console.log('Контактная форма валидна:', isValid);
		console.log('Ошибки:', this._errors);

		this.emitChanges('contactsForm:valid', { isValid });
		this.emitChanges('formErrors:changed', { errors: this._errors });

		return isValid;
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

	reset(): void {
		console.log('Resetting order model');
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
