interface ILarekApi {
  getProductList: () => Promise<IProduct[]>;
  getProduct: (id: string) => Promise<IProduct>;
  orderProduct: (order: IOrder) => Promise<IOrderResult>;
}