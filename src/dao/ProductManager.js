import { readFile, writeFile } from 'fs/promises';

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    try {
      // Validar que todos los campos requeridos estén presentes en el cuerpo de la solicitud
      const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
      for (const field of requiredFields) {
        if (!product.hasOwnProperty(field)) {
          throw new Error(`El siguiente campo no se encuentra en el producto: ${field}`);
        }
      }
      
      const products = await this.getProducts();

      // Validar que el campo "code" no está repetido
      if (products.some(p => p.code === product.code)) {
        throw new Error(`El producto con el codigo: ${product.code}, ya existe`);
      }
      
      // Generar un nuevo ID para el producto
      const id = products.length !== 0 ? products[products.length - 1].id + 1 : 1
      const thumbnails = product.thumbnails ? product.thumbnails : []
      const newProduct = {
        id,
        ...product,
        status: true,
        thumbnails
      };
      
      products.push(newProduct);
      
      await writeFile(this.path, JSON.stringify(products, null, 2));
      
      return newProduct;
    } catch (error) {
      console.error(`Error agregado /products: ${error}`);
      return null;
    }
  }

  async getProducts(limit) {
    try {
      const products = await readFile(this.path, 'utf-8');
      const parsedProducts = JSON.parse(products);
  
      if (!limit || limit > parsedProducts.length) {
        return parsedProducts;
      }

      return parsedProducts.slice(0, limit);
    } catch (error) {
      console.error(`Error obteniendo /products: ${error}`);
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((product) => product.id === id);
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      return null;
    }
    const updatedProduct = { ...products[productIndex], ...updatedFields };
    products[productIndex] = updatedProduct;
    await this.saveProducts(products);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filteredProducts = products.filter((product) => product.id !== 
    Number(id));
    if (filteredProducts.length === products.length) {
      return null;
    }
    await this.saveProducts(filteredProducts);
    return true;
  }

  async saveProducts(products) {
    try {
      await writeFile(this.path, JSON.stringify(products));
      console.log('Productos agregados con exito');
    } catch (err) {
      console.error('Error guardando /products: ', err);
    }
  }
}

export default ProductManager;