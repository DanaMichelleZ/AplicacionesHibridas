const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const Usuario = require('./models/Usuario');

const app = express();
const port = 3000;

app.use(express.json());


mongoose.connect('mongodb://localhost:27017/desafio7', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
});


const validarRegistro = (datos) => {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(datos);
};


const validarLogin = (datos) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(datos);
};


app.post('/register', async (req, res) => {
    const { error } = validarRegistro(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const emailExiste = await Usuario.findOne({ email: req.body.email });
    if (emailExiste) return res.status(400).json({ error: 'El email ya está registrado' });

    const nuevoUsuario = new Usuario({
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const usuarioGuardado = await nuevoUsuario.save();
        res.json(usuarioGuardado);
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar el usuario' });
    }
});


app.post('/login', async (req, res) => {
    const { error } = validarLogin(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const usuario = await Usuario.findOne({ email: req.body.email });
    if (!usuario) return res.status(400).json({ error: 'El usuario no está registrado' });

    const passwordValido = await bcrypt.compare(req.body.password, usuario.password);
    if (!passwordValido) return res.status(400).json({ error: 'Contraseña incorrecta' });

    // Crear y asignar un token
    const token = jwt.sign({ _id: usuario._id, email: usuario.email }, 'mi_secreto', { expiresIn: '1h' });
    res.header('auth-token', token).json({
        mensaje: 'Login exitoso',
        token: token
    });
});


const verificarToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ error: 'Acceso denegado' });

    try {
        const verificado = jwt.verify(token, 'mi_secreto');
        req.usuario = verificado;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Token no válido' });
    }
};


app.get('/perfil', verificarToken, (req, res) => {
    res.json({
        mensaje: 'Accediste al perfil',
        usuario: req.usuario
    });
});


app.get('/', (req, res) => {
    res.send('API funcionando');
});


app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
