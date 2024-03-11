const express = require("express");
const path = require("path");
const ProductManager = require("./productManager");

const PUERTO = 8080;
const app = express();

const products = new ProductManager(path.join(__dirname, "./fileProducts.json"));

app.get("/", (req, res) => {
    res.send("Mi primera chamba con Express JS");
});

app.get("/products", async (req, res) => {
    try {
        const productList = await products.getProducts();
        const { limit } = req.query;
        if (!limit) {
            res.json(productList);
        } else {
            const limitNumber = parseInt(limit);
            if (!isNaN(limitNumber) && limitNumber > 0) {
                res.json(productList.slice(0, limitNumber));
            } else {
                res.status(400).send(`El límite '${limit}' es inválido.`);
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});

app.get("/products/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const product = await products.getProductById(productId);
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(404).send("Producto no encontrado");
    }
});

app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`);
});
