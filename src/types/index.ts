//импортируем брокер событий
import { EventEmitter } from "../components/base/events";

//Типы данных с которыми будете работать в приложении. Как минимум у вас должны быть описаны объекты приходящие к вам через API и объекты выводимые на экране. 
//Ваши модели в итоге должны будут трансформировать один тип в другой.

type PaymentMethod = 'cash' | 'card'  //при получении или онлайн
type CardViewType = 'catalog' | 'preview' | 'basket' // как будет выглядеть карточка товара

interface IProduct {
  id: string;
  title: string;
  price: number | null;
  description?: string;
  category: string;
  image: string;
  index?: number;
}