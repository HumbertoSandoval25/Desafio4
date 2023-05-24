import { Server } from "socket.io";
import ProductManager from "./dao/ProductManager.js";


const productManager = new ProductManager("./src/db/products.json");

const configureWebSockets = (server) => {
  const io = new Server(server);

  // Configurar eventos de Socket.io
  io.on("connection", (socket) => {
    console.log("New client connected");

    const emitProductList = async () => {
      const products = await productManager.getProducts();
      socket.emit("productList", products);
    };
    emitProductList();

    // Escuchar el evento de creación de un nuevo producto
    socket.on("createProduct", async (productData) => {
      try {
        await productManager.addProduct(productData);
        emitProductList();
      } catch (error) {
        console.error("Error creando el producto:", error);
      }
    });

    socket.on("deleteProduct", async (productId) => {
      await productManager.deleteProduct(productId);
      emitProductList();
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

export default configureWebSockets;