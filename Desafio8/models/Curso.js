const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    estudiantes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estudiante'
    }]
});

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;
