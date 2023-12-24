import * as cuid from "cuid";

export interface BasketItem {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    brand: string;
    type: string;
    desi: number;
    logistic: boolean;
}

export interface Basket {
    id: string;
    items: BasketItem[];
}

export class Basket implements Basket {
    id = cuid();
    items: BasketItem[] = [];
}

export interface BasketTotals {
    shipping: number;
    subtotal: number;
    total: number;
    desitotal: number;
}