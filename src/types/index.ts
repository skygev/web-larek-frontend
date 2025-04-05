//импортируем брокер событий
import { EventEmitter } from '../components/base/events';

//Типы данных с которыми будете работать в приложении. Как минимум у вас должны быть описаны объекты приходящие к вам через API и объекты выводимые на экране.
//Ваши модели в итоге должны будут трансформировать один тип в другой.

export type PaymentMethod = 'cash' | 'card'; //при получении или онлайн
export type CardViewType = 'catalog' | 'preview' | 'basket'; // как будет выглядеть карточка товара

export interface IProduct {
	id: string;
	title: string;
	price: number | null;
	description?: string;
	category: string;
	image: string;
	index?: number;
}

export interface IBasketModel {
	items: IProduct[]; // Товары в корзине
	total: number; // Общая сумма
	add(item: IProduct): void;
	remove(id: string): void;
	clear(): void;
}

export interface ICatalogModel {
	items: IProduct[];
	setItems(items: IProduct[]): void;
	getProduct(id: string): IProduct | undefined;
}

export interface ILarekApi {
	getProductList: () => Promise<IProduct[]>;
	getProduct: (id: string) => Promise<IProduct>;
	orderProduct: (order: IOrder) => Promise<IOrderResult>;
}

export interface IOrderResult {
	id?: string;
	total: number;
}

export interface IOrderModel {
	payment: PaymentMethod;
	address: string;
	email: string;
	phone: string;
	items: string[];
	total: number;
}

export type OrderForm = Omit<IOrder, 'total' | 'items'>;

export interface IOrder {
	payment?: PaymentMethod;
	email: string;
	phone: number;
	address: string;
	items: string[];
	total: number;
	setPaymentMethod(): void;
	setAddress(): void;
}
