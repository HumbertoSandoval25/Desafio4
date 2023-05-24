import express from 'express';
import { CartManager } from '../dao/CartManager.js';

const router = express.Router();
const cartManager = new CartManager('./src/db/carts.json');

// POST /api/carts/
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getCartById(cid);
  if (!cart) {
    res.status(404).json({ message: 'Carrito no encontrado' });
  } else {
    res.json(cart);
  }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params
  const { quantity } = req.body || 1;

  try {
    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;