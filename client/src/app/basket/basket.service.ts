 import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, BasketItem, BasketTotals } from '../shared/models/basket';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import { Product } from '../shared/models/product';
import { AccountService } from '../account/account.service';
import { Address } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<Basket | null>(null);
  basketSource$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<BasketTotals | null>(null);
  basketTotalSource$ = this.basketTotalSource.asObservable();
  address = this.getUserAddress();


  constructor(private http: HttpClient,  private accountService: AccountService) { }

  createPaymentIntent() {
    return this.http.post<Basket>(this.baseUrl + 'payments/' + this.getCurrentBasketValue()?.id, {})
      .pipe(
        map(basket => {
          this.basketSource.next(basket);
        })
      )
  }

  getShippingDistance(address: Address){
    return this.http.get<number>(`${this.baseUrl}shipping/citydistance/${address.city}`);
  }
  
  setShippingPrice(deliveryMethod: DeliveryMethod) {
    const basket = this.getCurrentBasketValue();
    if (basket) {
      //Delivery method 3 seçildiyse shipping price'ı --> delivery price *= distance şeklinde güncelle
      if (deliveryMethod.id === 3) {
        this.accountService.getUserAddress().subscribe(address => {
          if (address) {
            this.getShippingDistance(address).subscribe(distance => {
              basket.shippingPrice = deliveryMethod.price * distance;
              basket.deliveryMethodId = deliveryMethod.id;
              this.setBasket(basket);
            });
          }
        });
        
      } 

      //Delivery method diğerleriyse direkt shipping price = delivery price
      else {
        basket.shippingPrice = deliveryMethod.price;
        basket.deliveryMethodId = deliveryMethod.id;
        this.setBasket(basket);
      }
    }
  } 

  getUserAddress() {
    return this.http.get<Address>(this.baseUrl + 'account/address');
  }

  getBasket(id: string) {
    return this.http.get<Basket>(this.baseUrl + 'basket?id=' + id).subscribe({
      next: basket => {
        this.basketSource.next(basket);
        this.calculateTotals();
      }
    })
  }

  getBasketId(): string | null {
    return localStorage.getItem('basket_id');
  }

  setOnlyLogistic(id: string) {
    return this.http.get<Basket>(`${this.baseUrl}basket?id=${id}`).pipe(
      map(basket => {
        console.log('Gelen sepet:', basket);
        const totalDesi = basket.items.reduce((sum, item) => sum + (item.desi * item.quantity), 0);
        const hasLogisticItem = basket.items.some(item => item.logistic);
        return totalDesi > 30 || hasLogisticItem;
      })
    );
  }

  setBasket(basket: Basket) {
    return this.http.post<Basket>(this.baseUrl + 'basket', basket).subscribe({
      next: basket => {
        this.basketSource.next(basket);
        this.calculateTotals();
      }
    })
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: Product | BasketItem, quantity = 1) {
    if (this.isProduct(item)) item = this.mapProductItemToBasketItem(item);
    console.log(item);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, item, quantity);
    this.setBasket(basket);
  }

  removeItemFromBasket(id: number, quantity = 1) {
    const basket = this.getCurrentBasketValue();
    if (!basket) return;
    const item = basket.items.find(x => x.id === id);
    if (item) {
      item.quantity -= quantity;
      if (item.quantity === 0) {
        basket.items = basket.items.filter(x => x.id !== id);
      }
      if (basket.items.length > 0) this.setBasket(basket);
      else this.deleteBasket(basket);
    }
  }

  
  deleteBasket(basket: Basket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe({
      next: () => {
        this.deleteLocalBasket();
      }
    })
  }

  deleteLocalBasket() {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  private addOrUpdateItem(items: BasketItem[], itemToAdd: BasketItem, quantity: number): BasketItem[] {
    const item = items.find(x => x.id === itemToAdd.id);
    if (item) item.quantity += quantity;
    else {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }
    return items;
  }

  private createBasket(): Basket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(item: Product): BasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType,
      desi: item.desi,
      logistic: item.logistic
    }
  }

  public calculateTotals() {
    const basket = this.getCurrentBasketValue();
    if (!basket) return;
    const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const desitotal = basket.items.reduce((a, b) => (b.desi * b.quantity) + a, 0);
    const total = subtotal + basket.shippingPrice;
    this.basketTotalSource.next({shipping: basket.shippingPrice, total, subtotal, desitotal});
  }


  private isProduct(item: Product | BasketItem): item is Product {
    return (item as Product).productBrand !== undefined;
  }

  
}
