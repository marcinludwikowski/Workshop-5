document.addEventListener("DOMContentLoaded", function (){
    const apikey="1515b216-a8cf-445f-805c-c7767aedad80";
    const apihost = 'https://todo-api.coderslab.pl';

    function timerender(time){
        const hours=Math.floor(time/60);
        const minutes=time%60;
        return `${hours>0 ? `${hours}h` : ''}${minutes > 0 ? ` ${minutes}m` : ''}`;
    }

    function apiListTasks() {
        return fetch(
            apihost + '/api/tasks',
            {
                headers: { Authorization: apikey }
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
        if(status === 'open') {
            const finishButton = document.createElement('button');
            finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
            finishButton.innerText = 'Finish';
            headerRightDiv.appendChild(finishButton);
        }
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
        deleteButton.innerText = 'Delete';
        headerRightDiv.appendChild(deleteButton);
        const ul=document.createElement("ul");
        ul.className="list-group list-group-flush";
        section.appendChild(ul);

        apiListOperationsForTask(taskId).then(
            function (response){
                response.data.forEach(
                    function (operation){
                        renderOperation(ul, operation.id, status, operation.description, operation.timeSpent)
                    }
                )
            }
        )

        const divBody=document.createElement("div");
        divBody.className="card-body";
        section.appendChild(divBody);
        const form=document.createElement("form");
        divBody.appendChild(form);
        const divInput=document.createElement("div");
        divInput.className="input-group";
        form.appendChild(divInput);
        const input2=document.createElement("input");
        input2.type="text";
        input2.placeholder="Operation description";
        input2.className="form-control";
        input2.minLength="5";
        divInput.appendChild(input2);
        const divInputGroup=document.createElement("div");
        divInputGroup.className="input-group-append";
        divInput.appendChild(divInputGroup);
        const buttonInput=document.createElement("button");
        buttonInput.className="btn btn-info";
        buttonInput.innerText="Add";
        divInputGroup.appendChild(buttonInput);

    }

    function apiListOperationsForTask(taskId) {
        return fetch(
            apihost + `/api/tasks/` + taskId + `/operations`,
            {
                headers: { Authorization: apikey }
            }
        ).then(
            function(resp) {
                if(!resp.ok) {
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
//
        }
    }

        apiListTasks().then(function (response){
            response.data.forEach(function (task){
                renderTask(task.id, task.title, task.description, task.status);

            });
        });

    });