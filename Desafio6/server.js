const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

app.use(express.json());

// Middleware sirve archivos estaticos
app.use(express.static('public'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API funcionando');
});

// Autentica login
const usuarios = [
    {
        id: 1,
        nombre: 'usuario1',
        password: bcrypt.hashSync('password1', 10)
    },
    {
        id: 2,
        nombre: 'usuario2',
        password: bcrypt.hashSync('password2', 10)
    }
];

app.post('/login', (req, res) => {
    const { nombre, password } = req.body;
    const usuario = usuarios.find(u => u.nombre === nombre);

    if (!usuario) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const esValido = bcrypt.compareSync(password, usuario.password);
    if (!esValido) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: usuario.id }, 'mi_secreto', { expiresIn: '1h' });
    res.json({ token });
});

// Middleware verifica JWT
function autenticarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Acceso denegado, token faltante' });

    jwt.verify(token, 'mi_secreto', (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
}

// Ruta protegida
app.get('/protegido', autenticarToken, (req, res) => {
    res.json({ mensaje: 'Accediste a una ruta protegida', usuario: req.user });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
