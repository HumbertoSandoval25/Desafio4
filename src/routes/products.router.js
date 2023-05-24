import { Router } from 'express';
import ProductManager from '../dao/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./src/db/products.json');

// GET /api/products
router.get('/', async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const products = await productManager.getProducts(limit);
  res.json(products);
});

// GET /api/products/:id
router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(Number(req.params.pid));
  if (!product) {
    res.status(404).json({ message: 'Producto no encontrado' });
  } else {
    res.json(product);
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  const product = req.body;
  console.log(product);
  productManager.addProduct(product);
  res.status(201).json(product);
});

// PUT /api/products/:id
router.put('/:pid', async (req, res) => {
  const productId = Number(req.params.pid);
  const fields = req.body
  const updatedProduct = await productManager.updateProduct(productId, fields);
  res.json(updatedProduct);
});

// DELETE /api/products/:id
router.delete('/:pid', async (req, res) => {
  const productId = Number(req.params.pid);
  const deletedProduct = await productManager.deleteProduct(productId);
  if (!deletedProduct) {
    res.status(404).json({ message: 'Producto no encontrado' });
  } else {
    res.json(deletedProduct);
  }
});

export default router;