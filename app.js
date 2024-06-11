document.addEventListener('DOMContentLoaded', loadTodos); // Load todos when the document is ready

const ulEL = document.getElementById('ul-el');
const inputEL = document.getElementById('input-el');
const btnEL = document.getElementById('btn-el');
let leads = [];

btnEL.addEventListener('click', addTodo);

function addTodo() {
    const todoText = inputEL.value.trim(); 
    if (todoText !== '') {
        leads.push({ text: todoText, completed: false });
        saveTodos();
        render();
        inputEL.value = '';
        inputEL.focus(); // Set focus back to input after adding a todo
    }
}

function loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    leads = storedTodos ? JSON.parse(storedTodos) : [];
    render();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(leads));
}

function render() {
    ulEL.innerHTML = ''; // Clear existing HTML content before adding new items
    leads.forEach((lead, index) => {
        const li = document.createElement('li');
        li.textContent = lead.text;
        if (lead.completed) {
            li.style.textDecoration = 'line-through';
        }
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.className = "checkbox"
        checkbox.checked = lead.completed;
        checkbox.addEventListener('change', () => {
            toggleComplete(index);
            setTimeout(() => {
                deleteTodo(index);
            }, 60000); // Delete after 1 minute (60000 ms)
        });

        li.appendChild(checkbox);
        ulEL.appendChild(li);
    });
}

function toggleComplete(index) {
    leads[index].completed = !leads[index].completed;
    saveTodos();
    render();
}

function deleteTodo(index) {
    leads.splice(index, 1);
    saveTodos();
    render();
}

