function handleCommand() {
    const commandInput = document.getElementById('commandInput').value.trim();
    const [command, id] = commandInput.split(' ');
    const jsonResult = document.getElementById('jsonResult');
    const textResult = document.getElementById('textResult');

    jsonResult.innerHTML = 'Loading...';
    textResult.innerHTML = 'Loading...';

    if (command.toLowerCase() === 'fork') {
        document.getElementById('forkFields').style.display = 'block';
    } else if (command.toLowerCase() === 'ls') {
        if (id) {
            fetch(`/tasks/${id}`)
                .then(response => response.json())
                .then(data => {
                    jsonResult.innerHTML = JSON.stringify(data, null, 2);
                    textResult.innerHTML = `Task ID: ${data.id}\nName: ${data.name}\nDescription: ${data.description}\nStatus: ${data.status}\nCreated At: ${data.created_at}`;
                })
                .catch(error => {
                    jsonResult.innerHTML = JSON.stringify({ error: error.message }, null, 2);
                    textResult.innerHTML = `Error: ${error.message}`;
                });
        } else {
            fetch('/tasks')
                .then(response => response.json())
                .then(data => {
                    jsonResult.innerHTML = JSON.stringify(data, null, 2);
                    textResult.innerHTML = data.map(task => `ID: ${task.id}, Name: ${task.name}, Status: ${task.status}`).join('\n');
                })
                .catch(error => {
                    jsonResult.innerHTML = JSON.stringify({ error: error.message }, null, 2);
                    textResult.innerHTML = `Error: ${error.message}`;
                });
        }
    } else if (command.toLowerCase() === 'delete') {
        if (!id) {
            jsonResult.innerHTML = JSON.stringify({ error: 'Task ID is required' }, null, 2);
            textResult.innerHTML = 'Error: Task ID is required';
            return;
        }
        fetch(`/tasks/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.status === 204) {
                    jsonResult.innerHTML = JSON.stringify({ message: 'Task deleted successfully' }, null, 2);
                    textResult.innerHTML = 'Task deleted successfully';
                } else {
                    return response.json().then(data => {
                        throw new Error(data.detail || 'Deletion failed');
                    });
                }
            })
            .catch(error => {
                jsonResult.innerHTML = JSON.stringify({ error: error.message }, null, 2);
                textResult.innerHTML = `Error: ${error.message}`;
            });
    } else {
        jsonResult.innerHTML = JSON.stringify({ error: 'Unknown command' }, null, 2);
        textResult.innerHTML = 'Unknown command';
    }
}

function createTask() {
    const name = document.getElementById('taskName').value;
    const description = document.getElementById('taskDescription').value;
    const jsonResult = document.getElementById('jsonResult');
    const textResult = document.getElementById('textResult');

    if (!name) {
        jsonResult.innerHTML = JSON.stringify({ error: 'Task name is required' }, null, 2);
        textResult.innerHTML = 'Error: Task name is required';
        return;
    }

    fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
    })
    .then(response => response.json())
    .then(data => {
        jsonResult.innerHTML = JSON.stringify(data, null, 2);
        textResult.innerHTML = `Task Created:\nID: ${data.id}\nName: ${data.name}\nDescription: ${data.description}\nStatus: ${data.status}\nCreated At: ${data.created_at}`;
        document.getElementById('forkFields').style.display = 'none';
        document.getElementById('taskName').value = '';
        document.getElementById('taskDescription').value = '';
    })
    .catch(error => {
        jsonResult.innerHTML = JSON.stringify({ error: error.message }, null, 2);
        textResult.innerHTML = `Error: ${error.message}`;
    });
}