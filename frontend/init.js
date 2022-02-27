function getTasks() {
    document.getElementById('mainArea').innerHTML = '<span class="badge badge-primary badge-pill todo-available-tasks-text"> Available Tasks </span>';
    $.ajax({
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todos/',
        method: 'GET',
        success: function (data, status, xhr) {
            const length = data.length;
            if (data.length === 0) {
                document.getElementById('mainArea').innerHTML = '<ul class="list-group todo-available-tasks" id = "mainArea"><span class="badge badge-primary badge-pill todo-available-tasks-text">Available Tasks</span><li class="list-group-item d-flex justify-content-center align-items-center" id ="li1">Your task list is empty.</li></ul>'
            } else {
                for (var i = length - 1; i >= 0; i--) {
                    var cur_task = data[i].title;
                    var cur_taskID = data[i].id;
                    document.getElementById('mainArea').innerHTML += '<li class="list-group-item d-flex justify-content-between align-items-center" id = "li' + cur_taskID + '"><input id="input-button-' + cur_taskID + '" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task" value=\'' + cur_task + '\'><div id="done-button-' + cur_taskID + '" class="input-group-append hideme"><button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(\'' + cur_taskID + '\')">Done</button></div><div id="task-' + cur_taskID + '" class="todo-task">' + cur_task + '</div><span id="task-actions-' + cur_taskID + '"><button style="margin-right:5px;" type="button" onclick="editTask(\'' + cur_taskID + '\')" class="btn btn-outline-warning"><img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px" height="20px"></button><button type="button" class="btn btn-outline-danger" onclick="deleteTask(\'' + cur_taskID + '\')"><img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px" height="22px"></button></span></li>';
                }
            }
        },
        error: function (xhr, status, err) {
            displayErrorToast(err);
            displayErrorToast('Error occured while fetching your tasks. Reload again!');
        }
    })
}

$.ajax({
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    url: API_BASE_URL + 'auth/profile',
    method: 'GET',
    success: function (data, status, xhr) {
        document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
        document.getElementById('profile-name').innerHTML = data.name;
        getTasks();
    }
})
