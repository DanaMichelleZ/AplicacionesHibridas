const express = require('express');
const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const app = express();
const port = 3000;


app.use(express.json());


mongoose.connect('mongodb://localhost:27017/desafio5', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a la base de datos MongoDB');
}).catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
});


app.get('/', (req, res) => {
    res.send('API funcionando');
});

app.post('/productos', async (req, res) => {
    const { nombre, precio, categoria } = req.body;

    try {
        const nuevoProducto = new Producto({ nombre, precio, categoria });
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el producto' });
    }
});

// Obtener productos (GET)
app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Obtener producto por ID (GET)
app.get('/productos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Actualizar producto por ID (PUT)
app.put('/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, categoria } = req.body;

    try {
        const productoActualizado = await Producto.findByIdAndUpdate(
            id,
            { nombre, precio, categoria },
            { new: true } 
        );
        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(productoActualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Eliminar producto por ID (DELETE)
app.delete('/productos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const productoEliminado = await Producto.findByIdAndDelete(id);
        if (!productoEliminado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
