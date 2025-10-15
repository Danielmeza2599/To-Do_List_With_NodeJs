// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // FUNCIÓN PARA OBTENER Y MOSTRAR LAS TAREAS
    const fetchTasks = async () => {
        const response = await fetch('/tasks');
        const tasks = await response.json();
        
        taskList.innerHTML = ''; // Limpiar la lista antes de volver a dibujarla
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.description;
            li.dataset.id = task.id;

            if (task.completed) {
                li.classList.add('completed');
            }

            // Botón de eliminar
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.classList.add('delete-btn');
            
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    };

    // FUNCIÓN PARA CREAR UNA NUEVA TAREA
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que el formulario se envíe de la forma tradicional
        
        const description = taskInput.value;
        if (description.trim() === '') return;

        await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description }),
        });

        taskInput.value = ''; // Limpiar el input
        fetchTasks(); // Volver a cargar la lista de tareas
    });

    // MANEJAR CLICS EN LA LISTA (PARA ELIMINAR O COMPLETAR)
    taskList.addEventListener('click', async (e) => {
        const id = e.target.closest('li').dataset.id;
        
        // Si se hizo clic en el botón de eliminar
        if (e.target.classList.contains('delete-btn')) {
            await fetch(`/tasks/${id}`, {
                method: 'DELETE',
            });
            fetchTasks();
        } 
        // Si se hizo clic en el elemento de la lista para completarlo
        else if (e.target.tagName === 'LI') {
            const isCompleted = e.target.classList.contains('completed');
            await fetch(`/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !isCompleted }),
            });
            fetchTasks();
        }
    });

    // Carga inicial de las tareas
    fetchTasks();
});