//импортируем брокер событий
import { EventEmitter } from "../components/base/events";

//Типы данных с которыми будете работать в приложении. Как минимум у вас должны быть описаны объекты приходящие к вам через API и объекты выводимые на экране. 
//Ваши модели в итоге должны будут трансформировать один тип в другой.

type PaymentMethod = 'cash' | 'card'  //при получении или онлайн
type CardViewType = 'catalog' | 'preview' | 'basket' // как будет выглядеть карточка товара

interface IProduct {
  id: string;
  description?: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  index?: number;
}

interface ICatalogModel {
  items: IProduct[];
  setItems(items: IProduct[]): void; //чтобы установить после загрузки api
  getProduct(id: string): IProduct; //чтобы получить при рендере списков(при необходимости)
}

