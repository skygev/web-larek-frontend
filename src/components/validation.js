// Функция для показа ошибки
function showInputError(formElement, inputElement, errorMessage, config) {
	const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
	if (!errorElement) return;
	errorElement.textContent = errorMessage;
	errorElement.classList.add(config.errorActiveClass);
	inputElement.classList.add(config.inputErrorClass);
}

// Функция для скрытия ошибки
function hideInputError(formElement, inputElement, config) {
	const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
	if (!errorElement) return;
	errorElement.classList.remove(config.errorActiveClass);
	errorElement.textContent = '';
	inputElement.classList.remove(config.inputErrorClass);
}

// Функция проверки валидности поля ввода
function checkInputValidity(formElement, inputElement, config) {
	if (inputElement.validity.patternMismatch) {
		// Проверяем, есть ли кастомное сообщение об ошибке
		const customErrorMessage =
			inputElement.dataset.errorMessage || 'Некорректный ввод';
		showInputError(formElement, inputElement, customErrorMessage, config);
	} else if (!inputElement.validity.valid) {
		// Показываем стандартное сообщение об ошибке
		showInputError(
			formElement,
			inputElement,
			inputElement.validationMessage,
			config
		);
	} else {
		// Если поле валидно, скрываем ошибку
		hideInputError(formElement, inputElement, config);
	}
}

// Функция управления состоянием кнопки отправки
function toggleButtonState(inputList, buttonElement, config) {
	const hasInvalidInput = inputList.some(
		(inputElement) => !inputElement.validity.valid
	);
	if (hasInvalidInput) {
		buttonElement.setAttribute('disabled', true);
		buttonElement.classList.add(config.inactiveButtonClass);
	} else {
		buttonElement.removeAttribute('disabled');
		buttonElement.classList.remove(config.inactiveButtonClass);
	}
}

// Установка слушателей для формы
function setEventListeners(formElement, config) {
	const inputList = Array.from(
		formElement.querySelectorAll(config.inputSelector)
	);
	const buttonElement = formElement.querySelector(config.submitButtonSelector);

	// Устанавливаем начальное состояние кнопки
	toggleButtonState(inputList, buttonElement, config);

	// Добавляем обработчики событий для каждого поля ввода
	inputList.forEach((inputElement) => {
		inputElement.addEventListener('input', () => {
			checkInputValidity(formElement, inputElement, config);
			toggleButtonState(inputList, buttonElement, config);
		});
	});
}

// Функция для очистки полей ввода и скрытия ошибок
function clearInputFields(popup, config) {
	const inputFields = popup.querySelectorAll(config.inputSelector);
	const formElement = popup.querySelector('form');
	inputFields.forEach((input) => {
		input.value = ''; //очистка inputs
		hideInputError(formElement, input, config); //очистка ошибок
	});
	const buttonElement = popup.querySelector(config.submitButtonSelector);
	if (buttonElement) {
		const inputList = Array.from(popup.querySelectorAll(config.inputSelector));
		toggleButtonState(inputList, buttonElement, config);
	}
}

// Включение валидации для всех форм
function enableValidation(config) {
	const formList = Array.from(document.querySelectorAll(config.formSelector));
	formList.forEach((formElement) => {
		setEventListeners(formElement, config);
	});
}

export { enableValidation, clearInputFields };
