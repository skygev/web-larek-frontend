import { Model } from '../base/Model';
import { IBasketModel, IProduct } from '../../types';

export class BasketModel extends Model<IBasketModel> implements IBasketModel {
	private _items: Map<string, IProduct> = new Map();
	private _totalValue: number = 0;

	get items(): IProduct[] {
		return Array.from(this._items.values());
	}

	get total(): number {
		return this._totalValue;
	}

	add(item: IProduct): void {
		this._items.set(item.id, item);
		this._totalValue += item.price ?? 0;
		this.emitChanges('basket:changed');
	}

	remove(id: string): void {
		const item = this._items.get(id);
		if (item) {
			this._items.delete(id);
			this._totalValue -= item.price ?? 0;
			this.emitChanges('basket:changed', this.getData());
		}
	}

	clear(): void {
		this._items.clear();
		this._totalValue = 0;
		this.emitChanges('basket:changed', this.getData());
	}

	getData(): IBasketModel {
		return {
			items: this.items,
			total: this.total,
			add: this.add.bind(this),
			remove: this.remove.bind(this),
			clear: this.clear.bind(this),
		};
	}
}
