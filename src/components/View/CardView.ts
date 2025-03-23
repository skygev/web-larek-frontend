interface ICard {
  title: string;
  image?: string;
  category?: string;
  price: number;
  button?: HTMLButtonElement;
  renderProductItem(): void;
}

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}