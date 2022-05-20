const fs = require('fs');
const express = require('express');

// Clase Contenedor
class Contenedor {

    static encoding = 'utf-8';
    static ruta = './productos.txt';

    constructor() {
        this.id = 0;
    };

    async save (product) {
        try {
            const all = await this.getAll();
                let idAnterior = 0;

                all.map(p => {
                    return idAnterior = p.id;
                });

                product.map(p => {
                    p.id = idAnterior + 1;
                    idAnterior ++;
                    all.push(p);
                })
                await fs.promises.writeFile(Contenedor.ruta, JSON.stringify(all, null, 2));
            console.log('Se guardó correctamente el producto');
        } catch (error) {
            console.log("Ocurrió un error, volvé a intentarlo");
            console.log(error);
        };
    };

    async getById(id) {
        try {
            const all = await this.getAll();
            const product = all.find(p => {
                return p.id === id
            });
            return product;
        } catch (error) {
            console.log("Ocurrió un error, volvé a intentarlo");
            console.log(error);
        };
    };

    async getAll() {
        try {
            const prod = await fs.promises.readFile(Contenedor.ruta, Contenedor.encoding);
            let obj = [];
            if (prod != "") {
                return obj = JSON.parse(prod);
            };
            return obj;
        } catch (error) {
            console.log("Ocurrió un error, volvé a intentarlo");
            console.log(error);
        };
    };

    async deleteById(id) {
        try {
            const all = await this.getAll();
            const del = all.filter(p => {
                return p.id != id;
            });
            await fs.promises.writeFile(Contenedor.ruta, JSON.stringify(del, null, 2));
            console.log(`El producto con id ${id} se borró correctamente`);
        } catch (error) {
            console.log("Ocurrió un error, volvé a intentarlo");
            console.log(error);
        };
    };

    async deleteAll() {
        try {
            const all = await this.getAll();
            await fs.promises.writeFile(Contenedor.ruta, "");
            console.log("Todos los productos fueron eliminados");
        } catch (error) {
            console.log("Ocurrió un error, volvé a intentarlo");
            console.log(error);
        };
    };
};


const producto1 = {
    title: "Remera",
    price: 2000,
    thumbnail: "https://deliverind.com.ar/wp-content/uploads/2022/01/REMERA-BASIC-scaled.jpg"
};
const producto2 = {
    title: "Pantalón",
    price: 4000,
    thumbnail: "https://www.instyle.es/medio/2019/02/04/pantalones-vaqueros-cropped-primavera-uterque_b2a5edab_1000x1499.jpg"
};
const producto3 = {
    title: "Zapatillas",
    price: 10000,
    thumbnail: "https://media.vogue.es/photos/6120c767358123b52e2edbbe/master/w_320%2Cc_limit/Captura%2520de%2520pantalla%25202021-08-21%2520a%2520las%252011.29.06.png"
};

const productos = new Contenedor;

const saveProducts = async (product) => {
    await productos.save(product);
};

const showProductById = async (id) => {
    console.log(await productos.getById(id));
};

const showAll = async () => {
    return await productos.getAll();
};



// Server
const app = express();
const PORT = 8080;

// Llamada a las funciones
console.clear();

saveProducts([producto1, producto2, producto3]);

app.get('/productos', (req, res) => {
    const showAll = async () => {
        res.json(await productos.getAll());
    };

    try {
        showAll();
    } catch (error) {
        res.end(console.log("Hubo un problema, volvé a intentarlo", error));
    };
    
});

app.get('/productoRandom', (req, res) => {
    const showProductById = async (id) => {
        res.json(await productos.getById(id));
    };

    const id = Math.floor(Math.random()*(4 - 1) + 1);

    try {
        console.log(id)
        showProductById(id)
    } catch (error) {
        console.log(error);
        res.end("Hubo un problema, volvé a intentarlo");
    };
});

app.get('/*', (req, res) => {
    res.end("La ruta que estas buscando no existe");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});