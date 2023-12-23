import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Address } from 'src/app/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class CheckoutDeliveryService {
  baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getShippingDistance(address: Address){
    return this.http.get<number>(`${this.baseUrl}shipping/citydistance/${address.city}`);
  }
}