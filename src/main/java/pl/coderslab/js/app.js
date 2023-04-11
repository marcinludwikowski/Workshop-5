document.addEventListener("DOMContentLoaded", function () {
    const apikey = "65403303-69fd-435b-81b6-51f669e19307";
    const apihost = 'https://todo-api.coderslab.pl';

    function timerender(time) {
        const hours = Math.floor(time / 60);
        const minutes = time % 60;
        return `${hours > 0 ? `${hours}h` : ''}${minutes > 0 ? ` ${minutes}m` : ''}`;
    }

    function apiListTasks() {
        return fetch(
            apihost + '/api/tasks',
            {
                headers: {Authorization: apikey}
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    }

    function renderTask(taskId, title, description, status) {
        const section = document.createElement("section");
        section.className = 'card mt-5 shadow-sm';
        document.querySelector('main').appendChild(section);

        const headerDiv = document.createElement('div');
        headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
        section.appendChild(headerDiv);

        const headerLeftDiv = document.createElement('div');
        headerDiv.appendChild(headerLeftDiv);

        const h5 = document.createElement('h5');
        h5.innerText = title;
        headerLeftDiv.appendChild(h5);

        const h6 = document.createElement('h6');
        h6.className = 'card-subtitle text-muted';
        h6.innerText = description;
        headerLeftDiv.appendChild(h6);

        const headerRightDiv = document.createElement('div');
        headerDiv.appendChild(headerRightDiv);

        if (status === 'open') {
            const finishButton = document.createElement('button');
            finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
            finishButton.innerText = 'Finish';
            headerRightDiv.appendChild(finishButton);
        }
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
        deleteButton.innerText = 'Delete';
        headerRightDiv.appendChild(deleteButton);

        deleteButton.addEventListener("click", function (){
            apiDeleteTask(taskId).then( function (response){
                    section.parentElement.removeChild(section);
                }
            )
        })

        const ul = document.createElement("ul");
        ul.className = "list-group list-group-flush";
        section.appendChild(ul);

        apiListOperationsForTask(taskId).then(
            function (response) {
                response.data.forEach(
                    function (operation) {
                        renderOperation(ul, operation.id, status, operation.description, operation.timeSpent)
                    }
                );
            }
        );

        if (status === 'open') {

            const addOperationDiv = document.createElement('div');
            addOperationDiv.className = 'card-body js-task-open-only';
            section.appendChild(addOperationDiv);

            const form = document.createElement('form');
            addOperationDiv.appendChild(form);

            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            form.appendChild(inputGroup);

            const descriptionInput = document.createElement('input');
            descriptionInput.setAttribute('type', 'text');
            descriptionInput.setAttribute('placeholder', 'Operation description');
            descriptionInput.setAttribute('minlength', '5');
            descriptionInput.className = 'form-control';
            inputGroup.appendChild(descriptionInput);

            const inputGroupAppend = document.createElement('div');
            inputGroupAppend.className = 'input-group-append';
            inputGroup.appendChild(inputGroupAppend);

            const addButton = document.createElement('button');
            addButton.className = 'btn btn-info';
            addButton.innerText = 'Add';
            inputGroupAppend.appendChild(addButton);

            form.addEventListener('submit', function(event) {
                event.preventDefault();
                apiCreateOperationForTask(taskId, descriptionInput.value).then(
                    function(response) {
                        renderOperation(
                            ul,
                            status,
                            response.data.id,
                            response.data.description,
                            response.data.timeSpent
                        );
                    }
                )
            });
        }
    }


    function apiListOperationsForTask(taskId) {
        return fetch(
            apihost + `/api/tasks/` + taskId + `/operations`,
            {
                headers: {Authorization: apikey}
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        );
    }


    function renderOperation(operationsList, status, operationId, operationDescription, timeSpent) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        operationsList.appendChild(li);


        const descriptionDiv = document.createElement('div');
        descriptionDiv.innerText = operationDescription;
        li.appendChild(descriptionDiv);

        const time = document.createElement('span');
        time.className = 'badge badge-success badge-pill ml-2';
        time.innerText = timerender(timeSpent);
        descriptionDiv.appendChild(time);

        const buttonsDiv = document.createElement("div");
        li.appendChild(buttonsDiv);

        const button15m = document.createElement("button");
        button15m.className = "btn btn-outline-success btn-sm mr-2";
        button15m.innerText = "+15m";
        buttonsDiv.appendChild(button15m);

        const button1h = document.createElement("button");
        button1h.className = "btn btn-outline-success btn-sm mr-2";
        button1h.innerText = "+1h";
        buttonsDiv.appendChild(button1h);

        const buttonDel = document.createElement("button")
        buttonDel.className = "btn btn-outline-danger btn-sm";
        buttonDel.innerText = "Delete";
        buttonsDiv.appendChild(buttonDel);


        if (status === "open") {

        }
    }

    apiListTasks().then(function (response) {
        response.data.forEach(function (task) {
            renderTask(task.id, task.title, task.description, task.status);

        });
    });

    function apiCreateTask(title, description) {
        return fetch(
            apihost + '/api/tasks',
            {
                method: 'POST',
                headers: {
                    'Authorization': apikey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title: title, description: description, status: 'open'})
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    }


    document.querySelector("form").addEventListener("submit", function (ev) {
        ev.preventDefault();
        const taskTitle = ev.currentTarget.elements.title.value;
        const taskDescription = ev.currentTarget.elements.description.value;
        apiCreateTask(taskTitle, taskDescription).then(function (response) {
            renderTask(response.data.id, response.data.title, response.data.description, response.data.status)
        })
    });
    function apiDeleteTask(taskId){
        return fetch(
            apihost + '/api/tasks/' + taskId,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': apikey,
                },
            }
        ).then(
            function(resp) {
                if(!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    }

    function apiCreateOperationForTask(taskId, description){
        return fetch(
            apihost + '/api/tasks/' + taskId + '/operations',
            {
                method: 'POST',
                headers: {
                    'Authorization': apikey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({description: description, timeSpent: 0})
            }
        ).then(
            function(resp) {
                if(!resp.ok) {
                    alert('Wystąpił błąd w dodawaniu operacji! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    }
});


