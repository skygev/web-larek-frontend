import { IEvents } from './events';

interface IModel<T> {
	getData(): T;
	emitChanges(event: string, payload?: object): void;
}

export abstract class Model<T> {
	constructor(protected events: IEvents) {}

	abstract getData(): T;

	emitChanges(event: string, payload?: object): void {
		this.events.emit(event, payload ?? {});
	}
}
