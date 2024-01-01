import { Component } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { DeliveryMethod } from '../models/deliveryMethod';
import { OrdersService } from 'src/app/orders/orders.service';
import { Order } from '../models/order';

@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrls: ['./order-totals.component.scss']
})
export class OrderTotalsComponent {

  constructor (public basketService: BasketService, public ordersService: OrdersService){} 
  

}
