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

    const UIModule = (() => {
        const dailyAffirmation = document.querySelector('.daily-affirmation-content');
        const toDoList = document.querySelector('.to-do-list');

        function displayAffirmation() {
            dailyAffirmation.textContent = Affirmation;
        }

        const renderToDo = () => {
            toDoList.innerHTML = '';
            toDoContainer.forEach((toDoTask, index) => {
                const toDo = document.createElement("li");
                toDo.setAttribute("data-index", index);
                toDo.classList.add(`to-do-item`, "rounded-md", 'shadow-[0_4px]', 'shadow-black', 'p-4', 'border-2', 'border-black', 'flex', 'justify-between', 'w-full', 'sm:max-w-[60%]');
                toDo.innerHTML = `<label for='task-${index}' class='flex gap-4'><input type='checkbox' id='task-${index}' class='accent-black rounded-md w-4 h-auto'>${toDoTask}</label><div class='toDo-changes flex gap-4 items-center'><i class="fas fa-edit edit-todo-btn"></i><i class="fa fa-trash flex items-center delete-todo-btn cursor-pointer"></i></div>`;
                toDoList.appendChild(toDo);
            })
        }

        return { displayAffirmation, renderToDo };
    })();

    const TodoController = (() => {
        const addTodoBtn = document.querySelector(".add-todo-btn");
        const toDoContent = document.querySelector(".to-do-content");
        const toDoList = document.querySelector('.to-do-list');

        const setupEventListener = () => {
            addTodoBtn.addEventListener("click", addToDo);
            toDoContent.addEventListener("keypress", handleAddToDoEnterKey);
            toDoList.addEventListener("click", deleteToDo);
        }

        const addToDo = () => {
            if (toDoContent.value.trim() !== '') {
                toDoContainer.push(toDoContent.value);
                UIModule.renderToDo();
                toDoContent.value = '';
            }
        }

        const handleAddToDoEnterKey = (event) => {
            if (event.key === "Enter") {
                addToDo();
            }
        }

        const deleteToDo = (event) => {
            if (event.target.classList.contains("delete-todo-btn")) {
                const toDoItem = event.target.closest(".to-do-item");
                const index = toDoItem.getAttribute("data-index");
                toDoItem.remove();
                toDoContainer.splice(index, 1);
                UIModule.renderToDo();
            }
        };

        const editToDo = (event) => {
            if (event.target.classList.contains("edit-todo-btn")) {
                event.target.closest(".to-do-item").textContent
            }
        }

        return { setupEventListener }

    })();


    const init = async () => {
        Affirmation = await FetchModule.fetchAffirmation();
        UIModule.displayAffirmation();
        TodoController.setupEventListener();
    }

    return { init };

})();

document.addEventListener('DOMContentLoaded', toDoApp.init);

