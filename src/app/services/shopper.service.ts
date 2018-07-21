import { environment } from '../../environments/environment';
import { Item } from '../models/item';
import { Product } from '../models/product';
import { Purchase } from '../models/purchase';
import { Shopper } from '../models/shopper';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopperService {
  apiURL = environment.apiURL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  constructor(private http: HttpClient) {}

  getShoppers(): Observable<Shopper[]> {
    return this.http.get<Shopper[]>(this.apiURL + 'activeShoppers');
  }

  purchase(shoppers: Shopper[], basket: Item[]): Observable<Object> {
    const purchase: Purchase = new Purchase();
    const shopperIds = [];
    shoppers.forEach(s => shopperIds.push(s.alumnumId));
    purchase.shoppers = shopperIds;
    purchase.items = basket;
    const date = new Date();
    purchase.date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-'
      + date.getDate() + ' '+ date.getHours() + ':' + date.getMinutes();
    return this.http.post(this.apiURL + 'purchase', JSON.stringify(purchase), this.httpOptions);
  }
}
