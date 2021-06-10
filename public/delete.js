async function deleteNamespace() {
    //const user = JSON.parse(localStorage.getItem('user'));
    let fetchData = {
        method: 'DELETE',
        body: new URLSearchParams({ 
            namespace_name: "name"//namespace name
        })
    }

    try {
        await fetch('/orders/namespace', fetchData)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                console.log(json);
            });
    } catch (err) {
        console.log(err);
    }
}

async function deleteUser() {
    let fetchData = {
        method: 'DELETE',
    }

    try {
        await fetch('/user/user', fetchData)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                console.log(json);
            });
    } catch (err) {
        console.log(err);
    }
}