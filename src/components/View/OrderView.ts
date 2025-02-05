interface IOrder {
	payment?: PaymentMethod;
	email: string;
	phone: number;
	address: string;
	items: string[];
	total: number;
  setPaymentMethod(): void;
  setAddress(): void;
}