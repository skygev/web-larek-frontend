import { EventEmitter } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { View } from '../base/component';

interface IFormValidation {
	isValid: boolean;
	errorMessages: string[];
}

export class DynamicForm<T> extends View<IFormValidation> {
	protected submitButton: HTMLButtonElement;
	protected errorContainer: HTMLElement;

	constructor(
		protected container: HTMLFormElement,
		protected events: EventEmitter
	) {
		super(events, container);

		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			container
		);
		this.errorContainer = ensureElement<HTMLElement>(
			'.form__errors',
			container
		);

		this.container.addEventListener('submit', (event: SubmitEvent) => {
			event.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		console.log('[FormView] Emitting:', `${this.container.name}:field-update`, {
			field,
			value,
		});
		this.events.emit(`${this.container.name}:field-update`, {
			field,
			value,
		});
	}

	set isValid(valid: boolean) {
		this.setDisabled(this.submitButton, !valid);
	}

	set errorMessages(messages: string[]) {
		this.setText(this.errorContainer, messages.join(', '));
	}

	resetForm(): void {
		this.isValid = false;
		this.errorMessages = [];
	}
}
