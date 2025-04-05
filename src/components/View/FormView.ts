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
		protected eventBus: EventEmitter
	) {
		super(eventBus, container);

		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			container
		);
		this.errorContainer = ensureElement<HTMLElement>(
			'.form__errors',
			container
		);

		this.setupEventHandlers();
	}

	private setupEventHandlers(): void {
		this.container.addEventListener('input', (event: Event) => {
			const inputElement = event.target as HTMLInputElement;
			const fieldName = inputElement.name as keyof T;
			this.handleFieldUpdate(fieldName, inputElement.value);
		});

		const addressInput = this.container.querySelector<HTMLInputElement>(
			'input[name="address"]'
		);
		if (addressInput) {
			addressInput.addEventListener('blur', () => {
				this.eventBus.emit(`${this.container.name}:validate`);
			});
		}

		this.container.addEventListener('submit', (event: SubmitEvent) => {
			event.preventDefault();
			this.eventBus.emit(`${this.container.name}:submit`);
		});
	}

	protected handleFieldUpdate(field: keyof T, value: string): void {
		this.eventBus.emit(`${this.container.name}:field-update`, {
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

	updateForm(data: Partial<T> & IFormValidation): HTMLElement {
		const { isValid, errorMessages, ...formData } = data;
		this.isValid = isValid;
		this.errorMessages = errorMessages || []; // Защита от undefined
		return this.render(formData);
	}
}
