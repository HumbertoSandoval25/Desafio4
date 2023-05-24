import cors from 'cors'
import express from 'express'
import handlebars from 'express-handlebars';
import apiProds from './routes/products.router.js'
import apiCarts from './routes/carts.router.js'
import views from './routes/views.router.js'
import configureWebSockets from './websockets.js'
import { __dirname } from './utils.js'

const PORT = 8080
const app = express()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.engine('hbs', handlebars.engine({
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: "views/layouts/",
  }));
app.set('view engine', 'hbs');
app.set("views", __dirname + "/views");


// Implementacion de Router
app.use('/', views)
app.use('/api/products', apiProds)
app.use('/api/carts', apiCarts)

const server = app.listen(PORT , (req, res) => {
  console.log(`Todo listo vamos, puerto ${PORT}`);
})

configureWebSockets(server);