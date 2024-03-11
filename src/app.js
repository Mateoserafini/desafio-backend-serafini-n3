const express = require("express"); // Importar express para crear el servidor
const path = require("path");// Importar el módulo path para trabajar con rutas de archivos
const ProductManager = require("./productManager");// Importar la clase ProductManager que maneja los productos
const PUERTO = 8080;// Definir el puerto en el que se ejecutará el servidor
const app = express();// Crear una instancia de la aplicación express
const products = new ProductManager(path.join(__dirname, "./fileProducts.json"));// Crear una instancia de ProductManager para manejar los productos


app.get("/", (req, res) => { // Definir una ruta para el endpoint 
    res.send("Mi primera chamba con Express JS");
});


app.get("/products", async (req, res) => { // Definir una ruta para el endpoint /products 
    try {
        // Obtener la lista de productos del ProductManager
        const productList = await products.getProducts();
        // Obtener el límite de resultados del query param 'limit'
        const { limit } = req.query;
        // Si no se proporciona un límite, devolver todos los productos
        if (!limit) {
            res.json(productList);
        } else {
            // Si se proporciona un límite, devolver solo el número de productos solicitados
            const limitNumber = parseInt(limit);
            if (!isNaN(limitNumber) && limitNumber > 0) {
                res.json(productList.slice(0, limitNumber));
            } else {
                // Si el límite proporcionado no es un número válido, devolver un error 400
                res.status(400).send(`El límite '${limit}' es inválido.`);
            }
        }
    } catch (error) {
        // Si ocurre un error al obtener los productos, devolver un error 500
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});


app.get("/products/:pid", async (req, res) => { // Definir una ruta para el endpoint /products/:pid 
    const productId = parseInt(req.params.pid);
    try {
        // Obtener el producto por su ID del ProductManager
        const product = await products.getProductById(productId);
        // Devolver el producto encontrado
        res.json(product);
    } catch (error) {
        // Si el producto no se encuentra, devolver un error 404
        console.error(error);
        res.status(404).send("Producto no encontrado");
    }
});


app.listen(PUERTO, () => { // Iniciar el servidor y escuchar en el puerto definido
    console.log(`Escuchando en http://localhost:${PUERTO}`);
});
