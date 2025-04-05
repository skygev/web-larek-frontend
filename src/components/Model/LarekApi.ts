import { IProduct, ILarekApi, IOrder, IOrderResult } from '../../types';

import { ApiListResponse, Api } from '../base/api';

export class LarekApi extends Api implements ILarekApi {
	readonly cdnUrl: string;

	constructor(
		cdnUrl: string,
		apiBaseUrl: string,
		requestOptions?: RequestInit
	) {
		super(apiBaseUrl, requestOptions);
		this.cdnUrl = cdnUrl;
	}

	getProduct(productId: string): Promise<IProduct> {
		return this.get(`/product/${productId}`).then((product: IProduct) => ({
			...product,
			image: `${this.cdnUrl}${product.image}`,
		}));
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((response: ApiListResponse<IProduct>) =>
			response.items.map((product) => ({
				...product,
				image: `${this.cdnUrl}${product.image}`,
			}))
		);
	}

	orderProduct(orderDetails: IOrder): Promise<IOrderResult> {
		return this.post('/order', orderDetails).then(
			(result: IOrderResult) => result
		);
	}
}
