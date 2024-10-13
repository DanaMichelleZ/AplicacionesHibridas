const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});


usuarioSchema.pre('save', async function (next) {
    const usuario = this;
    if (!usuario.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(usuario.password, salt);
    next();
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
