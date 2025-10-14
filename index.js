/* 
    * Proyecto: API para una lista de tareas (To-Do List) 
    * Descripción: Una versión sencilla de una API para una lista de tareas (To-Do List) usando Node.js y Express. No se usará una base de datos todavía; se guardaran las tareas en la memoria del servidor.
    * Autor: Daniel Meza
    * Fecha: 14/10/2025   
*/

// 1. Importar Express
const express = require('express');

// 2. Crear una instancia de Express
const app = express();
const port = 3000;

// 3. Middleware para que Express entienda JSON
app.use(express.json());

// 4. "Base de datos" en memoria (un simple arreglo)
let tasks = [
    { id: 1, description: 'Aprender Node.js', completed: false },
    { id: 2, description: 'Crear una API', completed: true },
    { id: 3, description: 'Desplegar en Render', completed: false }
];

// --- RUTAS DE LA API ---

// OBTENER TODAS LAS TAREAS (GET /tasks)
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// OBTENER UNA SOLA TAREA POR ID (GET /tasks/:id)
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(task);
});

// CREAR UNA NUEVA TAREA (POST /tasks)
app.post('/tasks', (req, res) => {
    const { description } = req.body;

    if (!description) {
        return res.status(400).json({ message: 'La descripción es requerida' });
    }

    const newTask = {
        id: tasks.length + 1, // Simple forma de generar un ID
        description: description,
        completed: false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// ACTUALIZAR UNA TAREA (PUT /tasks/:id)
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Actualizamos la descripción o el estado de completado
    const { description, completed } = req.body;
    if (description !== undefined) {
        task.description = description;
    }
    if (completed !== undefined) {
        task.completed = completed;
    }

    res.json(task);
});

// ELIMINAR UNA TAREA (DELETE /tasks/:id)
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Eliminamos la tarea del arreglo
    tasks.splice(taskIndex, 1);
    res.status(204).send(); // 204 significa "No Content", operación exitosa sin nada que devolver
});


// 5. Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});