function displaySuccessToast(message) {
    iziToast.success({
        title: 'Success',
        message: message
    });
}

function displayErrorToast(message) {
    iziToast.error({
        title: 'Error',
        message: message
    });
}

function displayInfoToast(message) {
    iziToast.info({
        title: 'Info',
        message: message
    });
}

const API_BASE_URL = 'http://localhost:8000/';

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}

function registerFieldsAreValid(firstName, lastName, username, password) {
    if (firstName === '' || lastName === '' || username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    if (password.length < 6) {
        displayErrorToast('Password should have atleast 6 characters.');
        return false;
    }
    return true;
}

function loginFieldsAreValid(username, password) {
    if (username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    return true;
}

function register() {
    const firstName = document.getElementById('inputFirstName').value.trim();
    const lastName = document.getElementById('inputLastName').value.trim();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (registerFieldsAreValid(firstName, lastName, username, password)) {
        const dataForApiRequest = {
            name: firstName + " " + lastName,
            username: username,
            password: password
        }

        $.ajax({
            url: API_BASE_URL + 'auth/register',
            method: 'POST',
            data: JSON.stringify(dataForApiRequest),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, xhr) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            },
            error: function (xhr, status, err) {
                displayErrorToast('An account using same username is already registered.');
            }
        })
    }
}

function login() {
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;
    const dataForApiRequest = {
        username: username,
        password: password
    }
    if (loginFieldsAreValid(username, password)) {
        $.ajax({
            url: API_BASE_URL + 'auth/login',
            method: 'POST',
            data: JSON.stringify(dataForApiRequest),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, xhr) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            },
            error: function (xhr, status, err) {
                displayErrorToast('Invalid Credentials!');
            }
        })
    }
}

function addTask() {
    const task = document.getElementById('taskContent').value.trim();
    if (!task) {
        displayErrorToast('Task can\'t be blank.');
        return;
    }

    const dataForApiRequest = {
        title: task
    };

    $.ajax({
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todos/',
        method: 'POST',
        data: JSON.stringify(dataForApiRequest),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, status, xhr) {
            window.location.href = '/';
        },
        error: function (xhr, status, err) {
            displayErrorToast('Error occured while creating task. Try again!');
        }
    });
}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    const del_li = "li" + id;
    $.ajax({
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todos/' + id,
        method: 'DELETE',
        success: function (data, status, xhr) {
            document.getElementById(del_li).remove();
            if (document.getElementById('mainArea').getElementsByTagName('li').length === 0) {
                document.getElementById('mainArea').innerHTML = '<ul class="list-group todo-available-tasks" id = "mainArea"><span class="badge badge-primary badge-pill todo-available-tasks-text">Available Tasks</span><li class="list-group-item d-flex justify-content-center align-items-center" id ="li1">Your task list is empty.</li></ul>';
            }
            displaySuccessToast('Task deleted.');
        },
        error: function (xhr, status, err) {
            displayErrorToast('Error occured. Try deleting again!');
        }
    })
}

function updateTask(id) {
    const input_id = 'input-button-' + id;
    const input_task = document.getElementById(input_id).value.trim();

    if (!input_task) {
        displayErrorToast('Task can\'t be empty.');
        return;
    }

    $.ajax({
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todos/' + id,
        method: 'PUT',
        data: JSON.stringify({
            title: input_task,
            id: id
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, status, xhr) {
            document.getElementById('task-' + id).innerHTML = data.title;
            document.getElementById('task-' + id).classList.remove('hideme');
            document.getElementById('task-actions-' + id).classList.remove('hideme');
            document.getElementById('input-button-' + id).classList.add('hideme');
            document.getElementById('done-button-' + id).classList.add('hideme');
            displaySuccessToast('Task updated.');
        },
        error: function (xhr, status, err) {
            document.getElementById('task-' + id).classList.remove('hideme');
            document.getElementById('task-actions-' + id).classList.remove('hideme');
            document.getElementById('input-button-' + id).classList.add('hideme');
            document.getElementById('done-button-' + id).classList.add('hideme');
            displayErrorToast('Error occured. Try editing again!');
        }
    })
}
