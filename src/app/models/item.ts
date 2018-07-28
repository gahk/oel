import { Product } from './product';
export class Item {
  productId: string;
  name: string;
  quantity: number;
  quantityType: string;
  current_price = 0;
  weight_price = 0;

  static createItemFromProduct(product: Product, priceStep: string): Item {
    const item = new Item();
    item.productId = product.productId;
    item.name = product.name;
    if (product.weight_price === '0') {
      if (product.current_price !== '0') {
        item.current_price = parseFloat(product.current_price);
      } else {
        item.current_price = parseFloat(priceStep);
      }
      item.quantity = 1;
      item.quantityType = 'x';
    } else {
      item.weight_price = parseFloat(product.weight_price);
      item.quantity = parseFloat(priceStep);
      item.quantityType = 'g';
    }
    return item;
  }
}
