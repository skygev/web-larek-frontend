function showInputError(formElement, inputElement, errorMessage, config) {
	const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
	if (!errorElement) return;
	errorElement.textContent = errorMessage;
	errorElement.classList.add(config.errorActiveClass);
	inputElement.classList.add(config.inputErrorClass);
}

function hideInputError(formElement, inputElement, config) {
	const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
	if (!errorElement) return;
	errorElement.classList.remove(config.errorActiveClass);
	errorElement.textContent = '';
	inputElement.classList.remove(config.inputErrorClass);
}

function checkInputValidity(formElement, inputElement, config) {
	if (!inputElement.dataset.touched) return;

	if (inputElement.validity.patternMismatch) {
		const customErrorMessage =
			inputElement.dataset.errorMessage || 'Некорректный ввод';
		showInputError(formElement, inputElement, customErrorMessage, config);
	} else if (!inputElement.validity.valid) {
		showInputError(
			formElement,
			inputElement,
			inputElement.validationMessage,
			config
		);
	} else {
		hideInputError(formElement, inputElement, config);
	}
}

function toggleButtonState(inputList, buttonElement, config) {
	const hasInvalidInput = inputList.some(
		(inputElement) =>
			inputElement.dataset.touched && !inputElement.validity.valid
	);
	if (hasInvalidInput) {
		buttonElement.setAttribute('disabled', true);
		buttonElement.classList.add(config.inactiveButtonClass);
	} else {
		buttonElement.removeAttribute('disabled');
		buttonElement.classList.remove(config.inactiveButtonClass);
	}
}

function setEventListeners(formElement, config) {
	const inputList = Array.from(
		formElement.querySelectorAll(config.inputSelector)
	);
	const buttonElement = formElement.querySelector(config.submitButtonSelector);

	inputList.forEach((inputElement) => {
		// Обработчик для первого ввода
		const handleFirstInteraction = () => {
			inputElement.dataset.touched = 'true';
			checkInputValidity(formElement, inputElement, config);
			toggleButtonState(inputList, buttonElement, config);
			// Удаляем этот обработчик после первого взаимодействия
			inputElement.removeEventListener('input', handleFirstInteraction);
			inputElement.removeEventListener('blur', handleFirstInteraction);
		};

		// Обработчики для последующих изменений
		inputElement.addEventListener('input', () => {
			if (inputElement.dataset.touched) {
				checkInputValidity(formElement, inputElement, config);
				toggleButtonState(inputList, buttonElement, config);
			}
		});

		// Вешаем обработчики первого взаимодействия
		inputElement.addEventListener('input', handleFirstInteraction);
		inputElement.addEventListener('blur', handleFirstInteraction);
	});
}

function clearInputFields(popup, config) {
	const inputFields = popup.querySelectorAll(config.inputSelector);
	const formElement = popup.querySelector('form');
	inputFields.forEach((input) => {
		input.value = '';
		delete input.dataset.touched;
		hideInputError(formElement, input, config);
	});
	const buttonElement = popup.querySelector(config.submitButtonSelector);
	if (buttonElement) {
		const inputList = Array.from(popup.querySelectorAll(config.inputSelector));
		toggleButtonState(inputList, buttonElement, config);
	}
}

function enableValidation(config) {
	const formList = Array.from(document.querySelectorAll(config.formSelector));
	formList.forEach((formElement) => {
		setEventListeners(formElement, config);
	});
}

export { enableValidation, clearInputFields };
