import type { CartItem } from "@/interfaces/cart-item";
import Cookies from "js-cookie";

export class CartCookiesClient {
  static getCart(): CartItem[] {
    return JSON.parse(Cookies.get("cart") ?? `[]`);
  }

  static addItem(cartItem: CartItem): CartItem[] {
    const cart = CartCookiesClient.getCart();

    const itemInCart = cart.find(
      (i) => i.productid === cartItem.productid && i.size === cartItem.productid
    );

    if (itemInCart) {
        itemInCart.quantity += cartItem.quantity;
    } else {
        cart.push(cartItem)
    };

    Cookies.set('cart', JSON.stringify(cart))
    return cart;
  }

  static removeItem(productId: string, size: string): CartItem[] {
    const cart = CartCookiesClient.getCart();
    const updatedCart = cart.filter( 
        (i) => (i.productid === productId && i.size === size));
    
    Cookies.set('cart', JSON.stringify(updatedCart))
    return updatedCart;
  }
}