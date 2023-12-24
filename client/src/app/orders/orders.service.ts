import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, map, mergeMap, of, switchMap, toArray } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address } from '../shared/models/user';
import { Order } from '../shared/models/order';
import { AccountService } from '../account/account.service';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private accountService: AccountService) { }
  private orderSource = new BehaviorSubject<Order | null>(null);
  orderSource$ = this.orderSource.asObservable();
  shipping = 0;

  getOrdersForUser(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl + 'orders').pipe(
      switchMap(orders => from(orders)), 
      mergeMap(order => 
        this.getShippingDistance(order.shipToAddress).pipe(
          map(distance => {
            order.shippingPrice = distance * order.shippingPrice;
            this.calculateTotals(order);
            return order;
          })
        )
      ),
      toArray(),
      map(orders => orders.sort((a, b) => b.id - a.id))
    );
  }

  getOrderDetailed(id: number): Observable<Order> {
    return this.http.get<Order>(this.baseUrl + 'orders/' + id).pipe(
      switchMap(order => 
        this.getShippingDistance(order.shipToAddress).pipe(
          map(distance => {
            order.shippingPrice = distance * order.shippingPrice;
            this.calculateTotals(order);
            return order;
          })
        )
      )
    );
  }
  
  getShippingDistance(address: Address){
    return this.http.get<number>(`${this.baseUrl}shipping/citydistance/${address.city}`);
  }

  private calculateTotals(order: Order) {
    const subtotal = order.orderItems.reduce((a, b) => (b.price * b.quantity) + a, 0);
    order.subtotal = subtotal;
    order.total = order.subtotal + order.shippingPrice; 
  }
  
}


  

