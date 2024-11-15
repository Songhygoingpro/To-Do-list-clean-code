const toDoApp = (() => {
    const apiKey = "ME6tUsrNFGvgRQMQ4dyidw==rWXPoG36hoUB83Xs";
    let Affirmation = '';
    let toDoContainer = [];

    const FetchModule = (() => {
        const fetchAffirmation = async () => {
            try {
                const response = await fetch("https://api.api-ninjas.com/v1/quotes?category=computers", {
                    method: 'GET',
                    headers: {
                        'X-Api-Key': apiKey  // Include the API key in the headers
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                return data[0].quote;
            } catch (error) {
                console.error("Failed to fetch affirmation:", error);
                return "Could not load affirmation.";
            }
        };
        return { fetchAffirmation };
    })();

    const HandleLocalStorage = (() => {
        function saveToLocalStorage(toDoList) {
            localStorage.setItem('toDoList', JSON.stringify(toDoList));
        }

        function loadFromLocalStorage() {
            const storedToDoList = localStorage.getItem('toDoList');
            return storedToDoList ? JSON.parse(storedToDoList) : [];
        }
        return { saveToLocalStorage, loadFromLocalStorage };
    })();

    const UIModule = (() => {
        const dailyAffirmation = document.querySelector('.daily-affirmation-content');
        const toDoList = document.querySelector('.to-do-list');

        function displayAffirmation() {
            dailyAffirmation.textContent = Affirmation;
        }

        const renderToDo = () => {
            toDoList.innerHTML = '';
            toDoContainer.forEach((toDoTask, index) => {
                if (toDoTask.Checked === true) {
                    const toDo = document.createElement("li");
                    toDo.setAttribute("data-index", index);
                    toDo.classList.add(`to-do-item`, "rounded-md", 'shadow-[0_4px]', 'shadow-black', 'p-4', 'border-2', 'border-black', 'flex', 'justify-between', 'w-full', 'sm:max-w-[60%]');
                    toDo.innerHTML = `<label for='task-${index}' class='flex gap-4'><input type='checkbox' id='task-${index}' class='task-checkbox accent-black rounded-md w-4 h-auto' checked>${toDoTask.Task}</label><div class='toDo-changes flex gap-4 items-center'><i class="fas fa-edit edit-todo-btn cursor-pointer"></i><i class="fa fa-trash flex items-center delete-todo-btn cursor-pointer"></i></div>`;
                    toDoList.appendChild(toDo);
                } else {
                    const toDo = document.createElement("li");
                    toDo.setAttribute("data-index", index);
                    toDo.classList.add(`to-do-item`, "rounded-md", 'shadow-[0_4px]', 'shadow-black', 'p-4', 'border-2', 'border-black', 'flex', 'justify-between', 'w-full', 'sm:max-w-[60%]');
                    toDo.innerHTML = `<label for='task-${index}' class='flex gap-4'><input type='checkbox' id='task-${index}' class='task-checkbox accent-black rounded-md w-4 h-auto'>${toDoTask.Task}</label><div class='toDo-changes flex gap-4 items-center'><i class="fas fa-edit edit-todo-btn cursor-pointer"></i><i class="fa fa-trash flex items-center delete-todo-btn cursor-pointer"></i></div>`;
                    toDoList.appendChild(toDo);
                }
            })
        }

        return { displayAffirmation, renderToDo };
    })();

    const TodoController = (() => {
        const addTodoBtn = document.querySelector(".add-todo-btn");
        const toDoContent = document.querySelector(".to-do-content");
        const toDoList = document.querySelector('.to-do-list');
        const toDoCount = document.querySelector('.tasks-count');
        const toDoCompleted = document.querySelector('.tasks-completed');
        const toDoItems = document.querySelectorAll('.to-do-item');
        let editingIndex = null;

        const setupEventListener = () => {
            addTodoBtn.addEventListener("click", addToDo);
            toDoContent.addEventListener("keypress", handleAddToDoEnterKey);
            toDoList.addEventListener("click", editToDo);
            toDoList.addEventListener("click", deleteToDo);
            toDoList.addEventListener('change', handleCheckedTask);
        };

        const addToDo = () => {
            if (toDoContent.value.trim() !== '') {
                if (editingIndex !== null) {
                    toDoContainer[editingIndex].Task = toDoContent.value;
                    editingIndex = null;
                    addTodoBtn.textContent = 'Add';
                } else {
                    toDoContainer.push({ 'Task': toDoContent.value, 'Checked': false });
                    HandleLocalStorage.saveToLocalStorage(toDoContainer);
                }
                UIModule.renderToDo();
                toDoContent.value = '';
                countToDo();
                countCompletedTodo();
            }
        };

        const handleAddToDoEnterKey = (event) => {
            if (event.key === "Enter") {
                addToDo();
            }
        };

        const deleteToDo = (event) => {
            if (event.target.classList.contains("delete-todo-btn")) {
                const toDoItem = event.target.closest(".to-do-item");
                const index = toDoItem.getAttribute("data-index");
                toDoContainer.splice(index, 1);
                HandleLocalStorage.saveToLocalStorage(toDoContainer);
                UIModule.renderToDo();
                countToDo();
                countCompletedTodo();
            }
        };

        const editToDo = (event) => {
            if (event.target.classList.contains("edit-todo-btn")) {
                const toDoItem = event.target.closest(".to-do-item");
                const index = toDoItem.getAttribute("data-index");
                toDoContent.value = toDoContainer[index].Task;
                editingIndex = index;
                addTodoBtn.textContent = 'Confirm';
                toDoContent.focus();
            }
        };

        const countToDo = () => {
            toDoCount.textContent = toDoContainer.length;
        };

        const handleCheckedTask = (event) => {
            if (event.target.classList.contains("task-checkbox")) {
                const toDoItem = event.target.closest(".to-do-item");
                const index = toDoItem.getAttribute("data-index");
                if (toDoContainer[index].Checked === false) {
                    toDoContainer[index].Checked = true;
                    countCompletedTodo();
                } else {
                    toDoContainer[index].Checked = false;
                    countCompletedTodo();
                }
            }
        };

        const countCompletedTodo = () => {
            toDoCompleted.textContent = 0;
            toDoContainer.forEach((toDo) => {
                if (toDo.Checked === true) {
                    toDoCompleted.textContent++;
                }
            })
        };

        return { setupEventListener };
    })();



    const init = async () => {
        Affirmation = await FetchModule.fetchAffirmation();
        UIModule.displayAffirmation();
        TodoController.setupEventListener();
        toDoContainer = await HandleLocalStorage.loadFromLocalStorage();
    }

    return { init };

})();

document.addEventListener('DOMContentLoaded', toDoApp.init);

