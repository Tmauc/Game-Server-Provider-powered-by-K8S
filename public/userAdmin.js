const getUser = async () => {
    const id = localStorage.getItem('user_id')
    let result = {};
    let fetchData = {
        method: 'POST',
        body: new URLSearchParams({ id: id })
    }
    await fetch('/admins/user', fetchData)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            result = json.users
            console.log(result);
        });

    const usersLis = document.getElementById('usersList');
    const data = [];
    if (result[0].userNamespace) {
        data.push(
            '<div class="card" style="width: 18rem;">' +
            '<div class="card-body">'
            + `<h5 class="card-title">Client namespace</h5>` +
            `<p class="card-text">name: ${result[0].userNamespace}</p>` +
            '</div>' +
            '</div>');
    }
    else {
        data.push(
            '<div class="card" style="width: 18rem;">' +
            '<div class="card-body">' +
            `<h5 class="card-title">The client doesn't have a namespace</h5>` +
            '</div>' +
            '</div>');
    }
    usersLis.innerHTML = data
}

getUser();