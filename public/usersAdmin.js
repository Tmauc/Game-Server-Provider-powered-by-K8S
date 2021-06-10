const deleteUser = async (id) => {
    let fetchData = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id
          })
    }
    await fetch('/user/user', fetchData)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            window.location.reload();
            const message = document.getElementById('message');
            const data = [];
            data.push(
                '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
                    'User successfully deleted' +
                    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                '</div>');
            message.innerHTML = data;
        })
        .catch(function() {
            const message = document.getElementById('message');
            const data = [];
            data.push(
                '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
                    'Something went wrong when deleting user' +
                    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                '</div>');
            message.innerHTML = data;
        })
}

const getShop = async () => {
    let result = {};
    let fetchData = {
        method: 'GET'
    }
    await fetch('/admins/users', fetchData)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            result = json.users
            console.log(result);
        });
    const usersLis = document.getElementById('usersList');
    const data = [];
    result.map((item) => {
        data.push(
            '<div class="card" style="width: 18rem;">' +
            '<div class="card-body">' +
            `<h5 class="card-title">${item.name}</h5>` +
            `<a href="#" onclick="go(${item.id})" class="btn btn-primary">See user</a>` +
            `<a href="#" onclick="deleteUser(${item.id})" class="btn btn-danger">Delete</a>` +
            '</div>' +
            '</div>');
    })
    usersLis.innerHTML = data
}
getShop();