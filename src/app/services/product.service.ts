import { environment } from '../../environments/environment';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiURL = environment.apiURL;
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURL + 'products');
  }
}
