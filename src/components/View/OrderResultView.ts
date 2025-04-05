import { IOrderResult } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';

interface IOrderResultActions {
	onClick: () => void;
}

export class OrderResultView extends Component<IOrderResult> {
	protected _total: HTMLElement;
	protected _close: HTMLElement;

	constructor(container: HTMLElement, actions: IOrderResultActions) {
		super(container);

		this._total = ensureElement<HTMLElement>(
			'.order-success_description',
			this.container
		);
		this._close = ensureElement<HTMLElement>(
			'.order-success_close',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}
