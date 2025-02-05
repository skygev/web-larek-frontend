interface IBasketModel {
  items: Map<string, { price: number; quantity: number }>; 
  add(id: string): void;
  remove(id: string): void;
  total(): number;
  clearBasket(): void;
  basketCounter(): number;
  setItems(): void;
}
