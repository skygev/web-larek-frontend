import { EventEmitter } from "../components/base/events";

//Типы данных с которыми будете работать в приложении. Как минимум у вас должны быть описаны объекты приходящие к вам через API и объекты выводимые на экране. 
//Ваши модели в итоге должны будут трансформировать один тип в другой.

type PaymentMethod = 'cash' | 'card' | 'undefined'  //при получении или онлайн

//Интерфейс для товара (перечень взят из описания данных из api)
//пользователь не может поменять данные товаров
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

//Интерфейс для хранения списка товаров
interface  ICatalogModel {
  items: IProduct[];
  setItems(items: IProduct[]): void; //чтобы установить после загрузки api
  getProduct(id: string): IProduct; //чтобы получить при рендере списков(при необходимости)
}

//интерфейс описывает объект, который уведомляет о наступлении какого-либо события
interface IEventEmitter {
  emit: (event: string, data: unknown) => void; //метод ничего не возвращает, его задача — только "оповестить" о событии
}

//Компоненты отображения
interface IViewConstructor { 
  new (container: HTMLElement, events?: EventEmitter): IView; //интерфейс для конструктора, на входе контейнер, в него будем выводить
}

interface IView { 
  render(data?: object): HTMLElement; //интерфейс для самого класса отображения, устанавливаем данные, возвращаем контейнер
}

class BasketItemView implements IView {
  // элементы внутри контейнера
  protected title: HTMLSpanElement;
  protected addButton: HTMLButtonElement;
  protected removeButton: HTMLButtonElement;

  // данные, которые хотим сохранить на будущее
  protected id: string | null = null;

  constructor(protected container: HTMLElement, protected events: IEventEmitter) {
    // Инициализируем элементы внутри контейнера
    this.title = container.querySelector('.basket-item__title') as HTMLSpanElement;
    this.addButton = container.querySelector('.basket-item__add') as HTMLButtonElement;
    this.removeButton = container.querySelector('.basket-item__remove') as HTMLButtonElement;

    // Устанавливаем события на кнопки
    this.addButton.addEventListener('click', () => {
      // Генерируем событие в нашем брокере для добавления в корзину
      this.events.emit('ui:basket-add', { id: this.id });
    });

    this.removeButton.addEventListener('click', () => {
      // Генерируем событие в нашем брокере для удаления из корзины
      this.events.emit('ui:basket-remove', { id: this.id });
    });
  }

  render(data: { id: string; title: string }): HTMLElement {
    if (data) {
      // Если есть новые данные, то заполним их
      this.id = data.id;
      // И выведем в интерфейс
      this.title.textContent = data.title;
    }
    return this.container;
  }
}

class BasketView implements IView {
  constructor(protected container: HTMLElement) {}

  render(data: { items: HTMLElement[] }) {
    if (data) {
      // Заменяем содержимое контейнера новыми элементами
      this.container.replaceChildren(...data.items);
    }
    // Возвращаем сам контейнер
    return this.container;
  }
}

//инициализация
const api = new ShopAPI();
const events = new EventEmitter();
const basketView = new BasketView(document.querySelector('.basket'));
const basketModel = new BasketModel(events);
const catalogModel = new CatalogModel(events);

const basket = new BasketModel(events);
events.on('basket:change', (data: {items:string[]}) => {

})

//можно собрать в функции или классы отдельные экраны с логикой их формирования
function renderBasket(item: string[]) {
  basketView.render(
    items.map(id => {
      const itemView = new BasketItemView(events);
      return itemView.render(catalogModel.getProduct(id));
    })
  )
}

//при изменении рендера
events.on('basket:change', (event: { items: string[]}) => {
  renderBasket(event.items)
});

//при действиях изменяем модель, а после этого случится рендер
events.on('ui:basket-add', (event: {id: string}) => {
  basketModel.add(id: string, price: number): void {
    const item = this.items.get(id);
    if (item) {
      item.quantity += 1; // Увеличиваем количество, если товар уже в корзине
    } else {
      this.items.set(id, { price, quantity: 1 }); // Добавляем новый товар
    }
    this._changed();
  };
});

events.on('ui:basket-remove', (events: {id: string}) => {
  basketModel.remove(id: string): void {
    if (this.items.has(id)) {
      const item = this.items.get(id);
      if (item!.quantity > 1) {
        item!.quantity -= 1; // Уменьшаем количество, если больше 1
      } else {
        this.items.delete(id); // Удаляем товар, если количество 1
      }
      this._changed();
    }
  };
});

//подгружаем начальные данные и запускаем процессы
api.getCatalog()
.then(catalogModel.setItems.bind(catalogModel))
.catch(err => console.error(err));


//интерфейс формы контактных данных
interface IContactForm {
  adress: string;
  email: string;
  phone: number;
  payment: PaymentMethod;
}

//интерфейс корзины
interface IBasketModel {
  items: Map<string, { price: number; quantity: number }>; 

  add(id: string, price: number): void; 
  remove(id: string): void;
}

// Реализация интерфейса корзины (вариант 2)
class BasketModel implements IBasketModel {
  items: Map<string, { price: number; quantity: number }> = new Map();

  constructor(protected events: IEventEmitter) {}

  add(id: string, price: number): void {
    this._changed();
  }
  remove(id: string): void {
    this._changed();
  }
  protected _changed() { //метод генерирующий уведомление об изменении корзины
    this.events.emit(
      'basket:change', 
      {items: Array.from(this.items.keys())});
  }
}



// Реализация интерфейса корзины (вариант 1)
/* class BasketModel implements IBasketModel {
  items: Map<string, { price: number; quantity: number }> = new Map();

  add(id: string, price: number): void {
    if (this.items.has(id)) {
      // Проверяем, есть ли товар с данным id в корзине.
      const item = this.items.get(id)!; 
      // Получаем текущий объект товара.
      item.quantity += 1; 
      // Увеличиваем количество товара на 1.
    } else {
      // Если товара с данным id нет в корзине:
      this.items.set(id, { price, quantity: 1 });
      // Добавляем новый товар с указанной ценой и количеством 1.
    }
  }

  remove(id: string): void {
    if (this.items.has(id)) {
      // Проверяем, есть ли товар с данным id в корзине.
      const item = this.items.get(id)!;
      // Получаем текущий объект товара.
      if (item.quantity > 1) {
        // Если количество товара больше 1:
        item.quantity -= 1; 
        // Уменьшаем количество товара на 1.
      } else {
        // Если количество товара равно 1:
        this.items.delete(id); 
        // Удаляем товар из корзины.
      }
    }
  }
} */













