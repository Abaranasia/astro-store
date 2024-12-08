import { loginUser, logout, registerUser } from './auth';
import { getproductBySlug, getProductsByPage } from './products';

export const server = {
  // actions

  // Auth
  loginUser,
  logout,
  registerUser,
  getProductsByPage,
  getproductBySlug,
};
