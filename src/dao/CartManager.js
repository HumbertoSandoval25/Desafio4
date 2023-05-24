import { readFile, writeFile } from 'fs/promises';

export class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      const carts = await readFile(this.path, 'utf-8');
      return JSON.parse(carts);
    } catch (error) {
      console.error(`Error consiguiendo /carts: ${error}`);
      return [];
    }
  }

  async saveCarts(carts) {
    try {
      await writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch (error) {
      console.error(`Error guardando /carts: ${error}`);
    }
  }

  async generateCartId() {
    const carts = await this.getCarts()
    return carts.length !== 0 ? carts[carts.length - 1].id + 1 : 1;
  }

  async createCart() {
    const cartId = await this.generateCartId();
    const newCart = { id: cartId, products: [] };
    const carts = await this.getCarts();
    carts.push(newCart);
    await this.saveCarts(carts);
    return newCart;
  }

  async getCartById(cartId) {
    const carts = await this.getCarts();
    return carts.find(cart => cart.id === Number(cartId));
  }

  async addProductToCart(cartId, productId, quantity) {
    const carts = await this.getCarts();
    const cart = carts.find(cart => cart.id === Number(cartId));
    if (!cart) {
      throw new Error(`Carrito con el ID ${cartId} no encontrado`);
    }
    const existingProduct = cart.products.find(product => Number(product.id) === Number(productId));
    if (existingProduct) {
      if (quantity) {
        existingProduct.quantity += quantity;
      } else {
        existingProduct.quantity += 1;
      }
    } else {
      const newProduct = { id: Number(productId), quantity: quantity || 1 };
      cart.products.push(newProduct);
    }
    await this.saveCarts(carts);
    return cart;
  }
}