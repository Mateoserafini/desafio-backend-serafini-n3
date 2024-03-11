const fs = require("fs").promises;
const fileProducts = "./fileProducts.json";

class ProductManager {
    static ultId = 0;

    constructor(filePath) {
        this.products = [];
        this.path = filePath || fileProducts;
        this.loadProducts(); // Cargar productos al inicializar la instancia
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path);
            this.products = JSON.parse(data);
            // Calcular el ID máximo para evitar conflictos al agregar nuevos productos
            const maxId = this.products.reduce((max, product) => Math.max(max, product.id), 0);
            ProductManager.ultId = maxId;
        } catch (err) {
            console.error('Error al cargar los productos:', err);
        }
    }

    async getProducts() {
        return this.products;
    }

    async addProduct(title, description, price, img, code, stock) {
        if (!title || !description || !price || !img || !code || !stock) {
            throw new Error("Todos los campos son obligatorios.");
        }

        if (this.products.some(item => item.code === code)) {
            throw new Error("El código debe ser único.");
        }

        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        }

        this.products.push(newProduct);
        await this.guardarProductos();
        return newProduct; // Devolver el producto añadido
    }

    async getProductById(id) {
        const product = this.products.find(item => item.id === id);
        if (!product) {
            throw new Error("Producto no encontrado.");
        }
        return product;
    }

    async guardarProductos() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (err) {
            console.error('Error al guardar los productos:', err);
        }
    }

    async updateProduct(id, updatedFields) {
        const i = this.products.findIndex(product => product.id === id);
        if (i !== -1) {
            this.products[i] = { ...this.products[i], ...updatedFields };
            await this.guardarProductos();
        } else {
            throw new Error("Producto no encontrado.");
        }
    }

    async deleteProduct(id) {
        this.products = this.products.filter(product => product.id !== id);
        await this.guardarProductos();
    }
}

module.exports = ProductManager;

