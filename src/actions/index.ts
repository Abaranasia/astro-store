import { loginUser, logout, registerUser } from './auth';
import { loadProductsFromCart } from './cart/load-products-from-cart.action';
import { getproductBySlug, getProductsByPage } from './products';
import { createUpdateProduct } from './products/create-update-product.action';

export const server = {
  // actions

  // Auth
  loginUser,
  logout,
  registerUser,

  // Products
  getProductsByPage,
  getproductBySlug,

  // Cart
  loadProductsFromCart,

  // Admin products
  createUpdateProduct,
};
