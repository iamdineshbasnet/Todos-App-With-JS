// Selectors
const inputTask = document.querySelector(".inputContainer input");
const submitBtn = document.querySelector(".inputContainer button");
const todosContainer = document.querySelector(".todos_list");
const placeholder = document.querySelector(".placeholder span");
const filters = document.querySelectorAll(".filters span");
const trashAll = document.querySelector(".controls .trash_all");

// Get the todo-list from local storage
let todos = JSON.parse(localStorage.getItem("todo-list"));

let editId; // variable to store the index of the task being edited
let isTaskEdited = false; // flag to check if a task is being edited or not

// initially show all the task
showTodo("all");

// when user click on add button invoke addTodo function
submitBtn.addEventListener("click", addTodo);

// when user press "Enter" key invoke addTodo function
inputTask.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        addTodo();
    }
});

// Placeholder Text for input field
const placeholderText = [
    "Zoom Meeting",
    "eat sleep code repeat",
    "Renew Gym Membership",
    "Cook Dinner",
    "Practice Math",
];

// Change random placeholder text on every 4 seconds
setInterval(() => {
    const randomNum = Math.round((Math.random() * 10) / 2);
    for (let i = 0; i <= placeholderText.length - 1; i++) {
        if (randomNum > placeholderText.length - 1) {
            placeholder.innerText = placeholderText[0];
        } else {
            placeholder.innerText = placeholderText[randomNum];
        }
    }
}, 4000);

// Function to update the status of a task
function updateTaskStatus(selectedTask) {
    // Get the label element for the selected task
    let taskName = selectedTask.parentElement.lastElementChild;

    // check if the checkbox is checked or unchecked
    if (selectedTask.checked) {
        // If the checkbox is checked, add the 'checked' class to the task's label element
        taskName.classList.add("checked");

        // update the status of the corresponding task in the 'todos' array to "completed"
        todos[selectedTask.id].status = "completed";
    } else {
        // If the checkbox is unchecked, remove the "checked" class from the task's label element
        taskName.classList.remove("checked");

        // update the status of the corresponding task in the 'todos' array to 'pending'
        todos[selectedTask.id].status = "pending";
    }

    // Save the updated 'todos' array to local storage
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

// function to edit the task
function editTask(taskId, taskName) {
    // set the 'editId' variable to the id of the task being edited
    editId = taskId;

    // set the isTaskEdited flag to true
    isTaskEdited = true;

    // Change the 'add' button to 'update' button
    submitBtn.innerText = "update";

    // set the input task value from edited task value
    inputTask.value = taskName;
}

// Function to delete particular task from todos list
function deleteTask(taskId) {
    // get the active filter
    let status = document.querySelector("span.active").id;

    // Remove the task from the todos list
    todos.splice(taskId, 1);

    // update the local storage with the new todos list
    localStorage.setItem("todo-list", JSON.stringify(todos));

    // show the updated todos list on the UI
    showTodo(status);
}

// Function to delete all the tasks from todos list
trashAll.addEventListener("click", (e) => {
    // get the active filter
    let status = document.querySelector("span.active").id;

    // Remove all the task from the todos list
    todos.splice(0, todos.length);

    // update the local storage with the new todos list
    localStorage.setItem("todo-list", JSON.stringify(todos));

    // show the updated todos list on the UI
    showTodo(status);
});

// Add event listener to each filter button
filters.forEach((btn) => {
    btn.addEventListener("click", () => {
        // remove active class from the previous active filter
        document.querySelector("span.active").classList.remove("active");
        // add active class to the selected filter button
        btn.classList.add("active");

        // call showTodo() function with the selected filter as argument
        showTodo(btn.id);
    });
});

function showMenu(selectedTask) {
    // get the task menu element
    let taskMenu = selectedTask.parentElement.lastElementChild;

    // add the 'active' class to show the menu
    taskMenu.classList.add("active");

    // Event Listener to hide the menu when clicked outside the menu
    document.addEventListener("click", (e) => {
        if (!e.target.classList.contains("more") || e.target != selectedTask) {
            taskMenu.classList.remove("active");
        }
    });
}

// Function to add todo task in localStorage
function addTodo() {
    // get the input value
    let userTask = inputTask.value;

    // get the active filter
    let status = document.querySelector("span.active").id;

    // if input value is empty show message
    if (!userTask) {
        console.log("input task first");
        return;
    }

    // If task is not edited add a new task
    if (!isTaskEdited) {
        // if todos don't exist, pass an empty array to todos
        if (!todos) {
            todos = [];
        }
        let taskInfo = {
            task: userTask,
            status: "pending",
            createdAt: Date.now(),
        };
        todos.push(taskInfo); // adding task to todos
    } else {
        // Else edit an existing task
        isTaskEdited = false;
        submitBtn.innerText = "add";
        todos[editId].task = userTask;
    }

    // save task in local storage with todo-list name
    localStorage.setItem("todo-list", JSON.stringify(todos));

    // Reset the value of an input field to empty
    inputTask.value = "";
    showTodo(status);
}

// Function to display task based on their status
function showTodo(filter) {
    // varaible to store task
    let li = "";

    // If todos exist, iterate the todos array
    if (todos) {
        todos.forEach((todo, id) => {
            // If the task's status is "completed" then assign the value of "isCompleted" to checked
            let isCompleted = todo.status === "completed" ? "checked" : "";

            const now = new Date();
            const createdAt = new Date(todo.createdAt);
            const timeDiff = (now - createdAt) / 1000; // in seconds

            let timeAgo;
            if (timeDiff < 60) {
                timeAgo = "Added Now";
            } else if (timeDiff < 60 * 60) {
                timeAgo = `${Math.floor(timeDiff / 60)} min ago`;
            } else if (timeDiff < 60 * 60 * 24) {
                timeAgo = `${Math.floor(timeDiff / (60 * 60))} hrs ago`;
            } else {
                timeAgo = `${Math.floor(timeDiff / (60 * 60 * 24))} days ago`;
            }
            // Check if the task's status matches the filter criteria or filter is set to "all" then add task's details to "li" variable
            if (filter === todo.status || filter === "all") {
                li += `
                    <li class="list">
                        <div class="item">
                            <input type="checkbox" onClick='updateTaskStatus(this)' id="${id}" ${isCompleted}/>
                            <label for="${id}" class="${isCompleted}">
                                <p>${todo.task} </p>
                                <span class="date">${timeAgo}</span>
                            </label>
                        </div>
                
                        <div class="moreIcon">
                            <ion-icon onClick="showMenu(this)" name="ellipsis-vertical" class='more'></ion-icon>
                            <ul class="item_control">
                                <li onClick="editTask(${id}, '${todo.task}')">
                                    <ion-icon name="create-outline" class="settingIcon"></ion-icon>
                                    <h4>Edit</h4>
                                </li>
                                <li onClick="deleteTask(${id})">
                                    <ion-icon name="trash-outline" class="settingIcon"></ion-icon>
                                    <h4>Trash</h4>
                                </li>
                            </ul>
                        </div>
                    </li>
                `;
            }
        });
    }

    // update the todosContainer
    todosContainer.innerHTML = li;
}
