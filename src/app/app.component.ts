import {Item} from './models/item';
import {Product} from './models/product';
import {Shopper} from './models/shopper';
import {ProductService} from './services/product.service';
import {ShopperService} from './services/shopper.service';
import {Component} from '@angular/core';
import {timer} from 'rxjs';

@Component({
  selector: 'app-root, number-pipe',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  products: Product[];
  shoppers: Shopper[];
  checkoutTimerSub;

  basket: Item[] = [];
  total = 0;
  alumneNumber = '';
  chosenShoppers: Shopper[] = [];
  countDownTime = 5;
  registrationName: string;
  
  showAlumneListeBool = false;

  constructor(private productService: ProductService, private shopperService: ShopperService) {
    const productTimer = timer(0, 600000);
    productTimer.subscribe(res => {
      this.productService.getProducts().subscribe(products => {
        this.products = products;
      });

      this.shopperService.getShoppers().subscribe(shoppers => {
        this.shoppers = shoppers;
      });
    });
  }

  addProductToBasket(product: Product, priceStep: string) {
    const item: Item = this.basket.find(i => i.productId === product.productId &&
      (priceStep === '' || i.current_price === parseFloat(priceStep) || i.weight_price !== 0));
    if (item !== undefined) {
      if (item.current_price !== 0) {
        if (priceStep === '' || item.current_price === parseFloat(priceStep)) {
          item.quantity = ++item.quantity;
        } else {
          this.basket.push(Item.createItemFromProduct(product, priceStep));
        }
      } else {
        item.quantity += parseFloat(priceStep);
      }
    } else {
      this.basket.push(Item.createItemFromProduct(product, priceStep));
    }
    this.updateTotal();
  }

  deleteItemFromBasket(item: Item) {
    const index = this.basket.indexOf(item);
    if (index !== -1) {
      this.basket.splice(index, 1);
      this.updateTotal();
    }
  }

  updateTotal() {
    this.total = 0;
    this.basket.forEach(i => this.total += i.current_price === 0 ? (i.weight_price / 100 * i.quantity) : (i.current_price * i.quantity));
  }

  addToAlumneNumber(numberToAdd: string) {
    if (numberToAdd === 'del') {
      if (this.alumneNumber.length !== 0) {
        this.alumneNumber = this.alumneNumber.substring(0, this.alumneNumber.length - 1);
      }
    } else {
      this.alumneNumber += numberToAdd;
    }
    if (this.alumneNumber.length === 3) {
      const shopper = this.shoppers.find(s => s.alumnumId === this.alumneNumber);
      if (shopper !== undefined && shopper !== null) {
        this.checkoutAsShopper(shopper);
      } else {
        this.showWrongNumber();
      }
    }
  }

  checkoutAsShopper(shopper: Shopper) {
    this.hideAlumneListe();
    this.chosenShoppers.push(shopper);
    if (this.chosenShoppers.length === 1) {
      this.registrationName = shopper.name;
    } else {
      this.registrationName = 'Delt køb';
    }
    this.startCheckoutCountdown();
  }

  checkoutAsShared() {
    this.registrationName = 'Delt køb';
    this.startCheckoutCountdown();
  }

  distributeOn(shopper: Shopper) {
    this.chosenShoppers.push(shopper);
  }

  startCheckoutCountdown() {
    this.showCheckout();
    const checkoutTimer = timer(1000, 1000);
    this.checkoutTimerSub = checkoutTimer.subscribe(res => {
      this.countDownTime--;
      if (this.countDownTime === 0) {
        this.checkout();
      }
    });
  }

  checkout() {
    this.checkoutTimerSub.unsubscribe();
    this.shopperService.purchase(this.chosenShoppers, this.basket).subscribe(res => {});
	this.reset();
  }

  cancel() {
    this.checkoutTimerSub.unsubscribe();
    this.hideCheckout();
    this.alumneNumber = '';
    this.chosenShoppers = [];
  }

  showCheckout() {
    document.getElementById('checkout').style.display = 'inline-block';
    document.getElementById('confirmation').style.display = 'inline-block';
  }

  hideCheckout() {
    document.getElementById('checkout').style.display = 'none';
    document.getElementById('confirmation').style.display = 'none';
  }

  showWrongNumber() {
    document.getElementById('checkout').style.display = 'inline-block';
    document.getElementById('wrongnumber').style.display = 'inline-block';
  }

  hideWrongNumber() {
    document.getElementById('checkout').style.display = 'none';
    document.getElementById('wrongnumber').style.display = 'none';
    this.alumneNumber = '';
  }

  showAlumneListe() {
    this.showAlumneListeBool = true;
  }

  hideAlumneListe() {
    this.showAlumneListeBool = false;
  }

  deleteShopperFromChosen(shopper: Shopper) {
    const index = this.chosenShoppers.indexOf(shopper);
    if (index !== -1) {
      this.chosenShoppers.splice(index, 1);
    }
  }

  resetChosenShoppers() {
    this.chosenShoppers = [];
  }

  reset() {
    this.alumneNumber = '';
    this.basket = [];
    this.updateTotal();
    document.getElementById('checkout').style.display = 'none';
    document.getElementById('confirmation').style.display = 'none';
    this.countDownTime = 5;
    this.registrationName = '';
    this.chosenShoppers = [];
  }
}
