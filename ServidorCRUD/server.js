const express = require('express');
const mongoose = require('mongoose');
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

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
