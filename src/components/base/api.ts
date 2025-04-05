export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	protected handleResponse(response: Response): Promise<object> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	get(uri: string) {
		console.log('📡 GET запрос:', this.baseUrl + uri);

		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		})
			.then(async (response) => {
				console.log('📝 Ответ от сервера:', response);
				const text = await response.text(); // Сырые данные ответа
				console.log('📜 Сырые данные:', text);

				try {
					const jsonData = JSON.parse(text);
					console.log('📦 Разобранный JSON:', jsonData);
					return jsonData;
				} catch (error) {
					console.error('❌ Ошибка парсинга JSON:', error);
					throw new Error('Ошибка парсинга JSON');
				}
			})
			.catch((error) => {
				console.error('🚨 Ошибка запроса:', error);
				throw error;
			});
	}

	post(uri: string, data: object, method: ApiPostMethods = 'POST') {
		console.log(`📡 ${method} запрос:`, this.baseUrl + uri, 'Данные:', data);

		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		})
			.then(async (response) => {
				console.log('📝 Ответ от сервера:', response);
				const text = await response.text(); // Сырые данные ответа
				console.log('📜 Сырые данные:', text);

				try {
					const jsonData = JSON.parse(text);
					console.log('📦 Разобранный JSON:', jsonData);
					return jsonData;
				} catch (error) {
					console.error('❌ Ошибка парсинга JSON:', error);
					throw new Error('Ошибка парсинга JSON');
				}
			})
			.catch((error) => {
				console.error('🚨 Ошибка запроса:', error);
				throw error;
			});
	}
}
