// ================================
// To-Do List Application
// ================================

// Application state
let tasks = [];

// Current filter
let currentFilter = "all";

// localStorage key
const STORAGE_KEY = "todoTasks";

// Get elements from the DOM
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

const filterButtons = document.querySelectorAll(".filter-btn");


// ================================
// LOCAL STORAGE
// ================================

// Save tasks to localStorage
function saveTasks() {
    window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );
}


// Load tasks from localStorage
function loadTasks() {

    const savedTasks = window.localStorage.getItem(STORAGE_KEY);

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    renderTasks();
}


// ================================
// CREATE TASK
// ================================

todoForm.addEventListener("submit", function (event) {

    // Prevent page refresh
    event.preventDefault();

    // Get user input
    const taskText = todoInput.value.trim();

    // Don't allow empty tasks
    if (taskText === "") {
        return;
    }

    // Create task object
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    // Add task to state
    tasks.push(newTask);

    // Save updated state
    saveTasks();

    // Clear input
    todoInput.value = "";

    // Display tasks
    renderTasks();
});


// ================================
// RENDER TASKS
// ================================

function renderTasks() {

    // Clear existing list
    taskList.innerHTML = "";

    // Apply current filter
    let filteredTasks = tasks;

    if (currentFilter === "active") {

        filteredTasks = tasks.filter(function (task) {
            return !task.completed;
        });

    } else if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function (task) {
            return task.completed;
        });
    }


    // Show empty message
    if (filteredTasks.length === 0) {

        if (currentFilter === "all") {
            emptyMessage.textContent =
                "No tasks yet. Add your first task!";
        } else if (currentFilter === "active") {
            emptyMessage.textContent =
                "No active tasks.";
        } else {
            emptyMessage.textContent =
                "No completed tasks.";
        }

        emptyMessage.style.display = "block";

        return;
    }


    // Hide empty message
    emptyMessage.style.display = "none";


    // Create task elements
    filteredTasks.forEach(function (task) {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }


        li.innerHTML = `
            <input
                type="checkbox"
                class="complete-checkbox"
                data-id="${task.id}"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-text">${task.text}</span>

            <div class="task-actions">

                <button
                    type="button"
                    class="edit-btn"
                    data-id="${task.id}">
                    Edit
                </button>

                <button
                    type="button"
                    class="delete-btn"
                    data-id="${task.id}">
                    Delete
                </button>

            </div>
        `;


        taskList.appendChild(li);
    });
}


// ================================
// EVENT DELEGATION - EDIT & DELETE
// ================================

taskList.addEventListener("click", function (event) {

    const target = event.target;

    const taskId = Number(target.dataset.id);


    // EDIT
    if (target.classList.contains("edit-btn")) {

        const task = tasks.find(function (task) {
            return task.id === taskId;
        });


        if (task) {

            const updatedText = prompt(
                "Edit your task:",
                task.text
            );


            if (
                updatedText !== null &&
                updatedText.trim() !== ""
            ) {

                task.text = updatedText.trim();

                // Save updated state
                saveTasks();

                // Update screen
                renderTasks();
            }
        }
    }


    // DELETE
    if (target.classList.contains("delete-btn")) {

        tasks = tasks.filter(function (task) {
            return task.id !== taskId;
        });

        // Save updated state
        saveTasks();

        // Update screen
        renderTasks();
    }
});


// ================================
// EVENT DELEGATION - COMPLETE TASK
// ================================

taskList.addEventListener("change", function (event) {

    const target = event.target;


    if (target.classList.contains("complete-checkbox")) {

        const taskId = Number(target.dataset.id);


        const task = tasks.find(function (task) {
            return task.id === taskId;
        });


        if (task) {

            task.completed = target.checked;

            // Save updated state
            saveTasks();

            // Update screen
            renderTasks();
        }
    }
});


// ================================
// FILTERING
// ================================

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Get selected filter
        currentFilter = button.dataset.filter;


        // Remove active class from all buttons
        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });


        // Add active class to selected button
        button.classList.add("active");


        // Display filtered tasks
        renderTasks();
    });
});s


// ================================
// INITIALIZE APPLICATION
// ================================

loadTasks();
