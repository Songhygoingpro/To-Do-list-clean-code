const toDoApp = (() => {
    const apiKey = "ME6tUsrNFGvgRQMQ4dyidw==rWXPoG36hoUB83Xs";
    let Affirmation = '';
    let toDoContainer = [];

    const StateManager = (() => {
        return {

        }
    })();

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
            toDoContainer.forEach((toDoTask, taskID) => {
                const toDo = document.createElement("li");
                toDo.classList.add(`to-do-item`, "rounded-md", 'shadow-[0_4px]', 'shadow-black', 'p-4', 'border-2', 'border-black', 'flex', 'justify-between', 'w-full', 'sm:max-w-[60%]');
                toDo.innerHTML = `<label for='${taskID}' class='flex gap-4'><input type='checkbox' id='task-${taskID}' class='rounded-md'><p>${toDoTask}</p></label><div class='toDo-changes flex gap-4'><i class="fa-regular fa-pen-to-square"></i><i class="fa fa-trash delete-todo-btn cursor-pointer"></i></div>`;
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
            toDoContent.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    addToDo();
                }
            });

            toDoList.addEventListener("click", deleteToDo);

        }

        const addToDo = () => {
            if (toDoContent.value.trim() !== '') {
                toDoContainer.push(toDoContent.value);
                UIModule.renderToDo();
                toDoContainer = [];
                toDoContent.value = '';
            }
        }

        const deleteToDo = (event) => {
            if (event.target.classList.contains("delete-todo-btn")) {
                event.target.closest(".to-do-item").remove();
            }
        };

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

