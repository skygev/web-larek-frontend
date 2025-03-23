interface ICatalogModel {
  items: IProduct[];
  setItems(items: IProduct[]): void; //чтобы установить после загрузки api
  getProduct(id: string): IProduct; //чтобы получить при рендере списков(при необходимости)
}