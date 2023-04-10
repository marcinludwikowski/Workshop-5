document.addEventListener("DOMContentLoaded", function (){

    const apikey="c058741c-66f0-4eb9-849a-fc24093049b9";
    const apihost = 'https://todo-api.coderslab.pl';

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

        const li=document.createElement("li");
        li.className="list-group-item d-flex justify-content-between align-items-center";
        ul.appendChild(li);

    }

    apiListTasks().then(function (response){
        response.data.forEach(function (task){
            renderTask(task.id, task.title, task.description, task.status);
        });
    });

});