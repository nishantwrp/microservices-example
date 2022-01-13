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

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}

function registerFieldsAreValid(firstName, lastName, email, username, password) {
    if (firstName === '' || lastName === '' || email === '' || username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        displayErrorToast("Please enter a valid email address.")
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
    const email = document.getElementById('inputEmail').value.trim();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
            name: firstName + " " + lastName,
            email: email,
            username: username,
            password: password
        }

        $.ajax({
            url: API_BASE_URL + 'auth/register/',
            method: 'POST',
            data: dataForApiRequest,
            success: function (data, status, xhr) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            },
            error: function (xhr, status, err) {
                displayErrorToast('An account using same email or username is already created');
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
        displayInfoToast("Please wait...");
        $.ajax({
            url: API_BASE_URL + 'auth/login/',
            method: 'POST',
            data: dataForApiRequest,
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
    const task = document.getElementById('taskContent').value;
    displayInfoToast('Processing...');
    const dataForApiRequest = {
        title: task
    }
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/create/',
        method: 'POST',
        data: dataForApiRequest,
        success: function (data, status, xhr) {
            displaySuccessToast('Task has been successfully added.');
            window.location.href = '/';
        },
        error: function (xhr, status, err) {
            displayErrorToast('Error occured while creating task. Try again!');
        }
    })

}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    const del_li = "li" + id;
    displayInfoToast('Processing...');
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/' + id,
        method: 'DELETE',
        data: {
            id: id
        },
        success: function (data, status, xhr) {
            displaySuccessToast('Task has been successfully deleted.');
            document.getElementById(del_li).remove();
        },
        error: function (xhr, status, err) {
            displayErrorToast('Error occured. Try deleting again!');
        }
    })
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',
        method: 'GET',
        success: function (data, status, xhr) {
            if (data.length == 1) {
                document.getElementById('mainArea').innerHTML = '<ul class="list-group todo-available-tasks" id = "mainArea"><span class="badge badge-primary badge-pill todo-available-tasks-text">Available Tasks</span><li class="list-group-item d-flex justify-content-between align-items-center" id ="li1">Nothing to see here. Your tasks will appear here.</li></ul>'
                displayInfoToast('Your task list is now empty.');
            }
        },
        error: function (xhr, status, err) {
            displayErrorToast(err);
            displayErrorToast('Error occured while fetching your tasks.');
        }
    })
}

function updateTask(id) {
    const input_id = 'input-button-' + id;
    const input_task = document.getElementById(input_id).value;
    console.log(input_id);
    displayInfoToast('Processing...');
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'PATCH',
        data: {
            title: input_task,
            id: id
        },
        success: function (data, status, xhr) {
            displaySuccessToast('Task has been successfully updated.');
            document.getElementById('task-' + id).innerHTML = data.title;
            document.getElementById('task-' + id).classList.remove('hideme');
            document.getElementById('task-actions-' + id).classList.remove('hideme');
            document.getElementById('input-button-' + id).classList.add('hideme');
            document.getElementById('done-button-' + id).classList.add('hideme');
        },
        error: function (xhr, status, err) {
            displayErrorToast('Error occured. Try editing again!');
            document.getElementById('task-' + id).classList.remove('hideme');
            document.getElementById('task-actions-' + id).classList.remove('hideme');
            document.getElementById('input-button-' + id).classList.add('hideme');
            document.getElementById('done-button-' + id).classList.add('hideme');
        }
    })
}
