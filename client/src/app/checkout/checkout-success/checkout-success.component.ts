import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from '@stripe/stripe-js';
import { Order } from 'src/app/shared/models/order';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent {

  order?: Order;
  
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.order = navigation?.extras?.state as Order
    
    if(this.order.deliveryMethod == 'LOGISTIC'){

    }
    
    
    console.log(this.order);

  }


}
