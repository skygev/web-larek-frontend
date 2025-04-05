import { DynamicForm } from './FormView';
import { OrderForm } from '../../types';

export class ContactsView extends DynamicForm<OrderForm> {
	set email(value: string) {
		const emailInput =
			this.container.querySelector<HTMLInputElement>('[name="email"]');
		if (emailInput) emailInput.value = value;
	}

	set phone(value: string) {
		const phoneInput =
			this.container.querySelector<HTMLInputElement>('[name="phone"]');
		if (phoneInput) phoneInput.value = value;
	}
}
