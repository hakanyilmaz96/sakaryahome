import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address } from '../shared/models/user';
import { CheckoutDeliveryService } from '../checkout/checkout-delivery/checkout-delivery.component.service';

import { Order } from '../shared/models/order';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private checkoutDeliveryService: CheckoutDeliveryService) { }

  getOrdersForUser(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl + 'orders');
  }
  

  getOrderDetailed(id: number): Observable<Order> {
    return this.http.get<Order>(this.baseUrl + 'orders/' + id);
  }
  
}
  

