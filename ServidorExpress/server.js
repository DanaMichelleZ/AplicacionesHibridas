const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Nombre: Dana, Apellido: [Zambelli]');
});

// info materia
app.get('/materia', (req, res) => {
    res.send('Materia: Aplicaciones Híbridas');
});

// info profe
app.get('/profesor', (req, res) => {
    res.send('Profesor: [CAMILA]');
});

// manejar pag no encontrada
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
