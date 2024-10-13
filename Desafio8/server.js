const express = require('express');
const mongoose = require('mongoose');
const Estudiante = require('./models/Estudiante');
const Curso = require('./models/Curso');
const app = express();
const port = 3000;

app.use(express.json());


mongoose.connect('mongodb://localhost:27017/desafio8', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a la base de datos MongoDB');
}).catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
});


app.get('/', (req, res) => {
    res.send('API Desafío 8 funcionando');
});


app.post('/estudiantes', async (req, res) => {
    const { nombre, email } = req.body;

    try {
        const nuevoEstudiante = new Estudiante({ nombre, email });
        const estudianteGuardado = await nuevoEstudiante.save();
        res.status(201).json(estudianteGuardado);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el estudiante' });
    }
});


app.put('/estudiantes/:id', async (req, res) => {
    const { nombre, email } = req.body;
    try {
        const estudianteActualizado = await Estudiante.findByIdAndUpdate(req.params.id, { nombre, email }, { new: true });
        if (!estudianteActualizado) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }
        res.json(estudianteActualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estudiante' });
    }
});


app.get('/estudiantes', async (req, res) => {
    try {
        const estudiantes = await Estudiante.find();
        res.json(estudiantes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los estudiantes' });
    }
});


app.get('/estudiantes/:id', async (req, res) => {
    try {
        const estudiante = await Estudiante.findById(req.params.id);
        if (!estudiante) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }
        res.json(estudiante);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el estudiante' });
    }
});


app.delete('/estudiantes/:id', async (req, res) => {
    try {
        const estudianteEliminado = await Estudiante.findByIdAndDelete(req.params.id);
        if (!estudianteEliminado) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }
        res.json({ mensaje: 'Estudiante eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el estudiante' });
    }
});


app.post('/cursos', async (req, res) => {
    const { titulo, descripcion } = req.body;

    try {
        const nuevoCurso = new Curso({ titulo, descripcion });
        const cursoGuardado = await nuevoCurso.save();
        res.status(201).json(cursoGuardado);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el curso' });
    }
});


app.get('/cursos', async (req, res) => {
    try {
        const cursos = await Curso.find();
        res.json(cursos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los cursos' });
    }
});


app.get('/cursos/:id', async (req, res) => {
    try {
        const curso = await Curso.findById(req.params.id);
        if (!curso) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }
        res.json(curso);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el curso' });
    }
});


app.put('/cursos/:id', async (req, res) => {
    const { titulo, descripcion } = req.body;
    try {
        const cursoActualizado = await Curso.findByIdAndUpdate(req.params.id, { titulo, descripcion }, { new: true });
        if (!cursoActualizado) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }
        res.json(cursoActualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el curso' });
    }
});


app.delete('/cursos/:id', async (req, res) => {
    try {
        const cursoEliminado = await Curso.findByIdAndDelete(req.params.id);
        if (!cursoEliminado) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }
        res.json({ mensaje: 'Curso eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el curso' });
    }
});


app.post('/cursos/:cursoId/inscribir/:estudianteId', async (req, res) => {
    const { cursoId, estudianteId } = req.params;

    try {
        const curso = await Curso.findById(cursoId);
        const estudiante = await Estudiante.findById(estudianteId);

        if (!curso || !estudiante) {
            return res.status(404).json({ error: 'Curso o estudiante no encontrado' });
        }

        curso.estudiantes.push(estudianteId);
        await curso.save();

        estudiante.cursos.push(cursoId);
        await estudiante.save();

        res.json({ mensaje: 'Estudiante inscrito en el curso correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al inscribir al estudiante en el curso' });
    }
});


app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
