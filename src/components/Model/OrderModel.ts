interface IOrderModel {
  payment?: PaymentMethod; // выбранный метод оплаты
  email: string; // email пользователя
  phone: number; // номер телефона пользователя
  address: string; // адрес доставки
  total: number | null; // сумма заказа
  items: string[]; // список товаров в заказе 
  id: string; // идентификатор заказа
  error?: string; // ошибка (если есть)
}