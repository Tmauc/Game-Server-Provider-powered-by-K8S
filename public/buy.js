async function buyNameSpace() {
    const button = document.getElementById('buttonNamespace');
    button.disabled = true;
    const user = JSON.parse(localStorage.getItem('user'));
    const str = user.name.replace(/\s/g, '');
    let fetchData = {
        method: 'POST',
        body: new URLSearchParams({
            namespace_name: `${str.toLowerCase()}`
        })
    }

    try {
        await fetch('/orders/namespace', fetchData)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                console.log(json);
                const message = document.getElementById('message');
                const data = [];
                data.push(
                    '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
                        'The namespace has been added' +
                        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                    '</div>');
                message.innerHTML = data;
                button.disabled = null;
                let fetchData = {
                    method: 'GET'
                }
                fetch('/user/user', fetchData)
                .then(function (response) {
                    return response.json();
                })
                .then(function (json) {
                    localStorage.setItem('user', JSON.stringify(json.user));
                    window.location.reload();
                });
            })
            .catch(function() {
                const message = document.getElementById('message');
                const data = [];
                data.push(
                    '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
                        'Something went wrong when buying a namespace' +
                        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                    '</div>');
                message.innerHTML = data;
                button.disabled = null;
            })
    } catch (err) {
        console.log(err);
        button.disabled = null;
    }
}

async function buyProduct(type) {
    if (type === 'Server') {
        const button = document.getElementById('button');
        button.disabled = true;
        let fetchData = {
            method: 'POST',
            body: new URLSearchParams({
                game_name: "minecraft"
            })
        }
        try {
            await fetch('/orders/server', fetchData)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                console.log(json);
                const message = document.getElementById('message');
                const data = [];
                data.push(
                    '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
                        'The minecraft server has been added' +
                        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                    '</div>');
                message.innerHTML = data;
                button.disabled = null;
            })
            .catch(function() {
                const message = document.getElementById('message');
                const data = [];
                data.push(
                    '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
                        'Something went wrong when buying a product' +
                        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                    '</div>');
                message.innerHTML = data;
                button.disabled = null;
            })
        } catch (err) {
            console.log(err);
            button.disabled = null;
        }
    }
}