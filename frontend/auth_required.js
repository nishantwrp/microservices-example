const token = localStorage.getItem('token');
if (token === null) {
    window.location.href = '/login/index.html';
} else {
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'auth/profile/',
        method: 'GET',
        success: function (data, status, xhr) {
            displaySuccessToast('You have been Authenticated.');
        },
        error: function (xhr, status, err) {
            window.location.href = '/login/index.html';
        }
    })
}
