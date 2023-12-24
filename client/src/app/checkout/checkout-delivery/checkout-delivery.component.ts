import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { DeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {
  logisticOptionDisabled = false;
  @Input() checkoutForm?: FormGroup;
  deliveryMethods: DeliveryMethod[] = [];

  constructor(private checkoutService: CheckoutService, public basketService: BasketService) {}

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe({
      next: dm => this.deliveryMethods = dm
    });
    
    const basketId = this.basketService.getBasketId();
    if (basketId) {
      this.basketService.setOnlyLogistic(basketId).subscribe(isDisabled => {
        this.logisticOptionDisabled = isDisabled;
      });
    }
  }

  setShippingPrice(deliveryMethod: DeliveryMethod) {    
    this.basketService.setShippingPrice(deliveryMethod);
  }

  
}
