import { Model } from '../base/Model';
import { IProduct, ICatalogModel } from '../../types';

export class CatalogModel
	extends Model<ICatalogModel>
	implements ICatalogModel
{
	private _items: IProduct[] = [];

	get items(): IProduct[] {
		return this._items;
	}

	setItems(items: IProduct[]): void {
		this._items = items;
		this.emitChanges('items:changed', this._items);
	}

	getProduct(id: string): IProduct | undefined {
		return this._items.find((item) => item.id === id);
	}

	getData(): ICatalogModel {
		return {
			items: this.items,
			setItems: this.setItems.bind(this),
			getProduct: this.getProduct.bind(this),
		};
	}
}
