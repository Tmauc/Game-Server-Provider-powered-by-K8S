const deleteDeployment = async (name) => {
    const button = document.getElementById('button');
    button.disabled = true;
    let fetchData = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            deployment_name: name
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
                        'The server deployment has been deleted' +
                        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
                    '</div>');
                message.innerHTML = data;
                button.disabled = null;
                window.location.reload();
            })
            .catch(function() {
                const message = document.getElementById('message');
                const data = [];
                data.push(
                    '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
                        'Something went wrong when buying a server deployment' +
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

const log = (name) => {
    localStorage.setItem('log', name)
    window.location.replace('/logUser')
}
const service = async (name) => {
    let result = null;
    let fetchData = {
        method: 'POST',
        body: new URLSearchParams({
            namespace_name: name
        })
    }
    await fetch('/orders/namespaceDeploymentsServices', fetchData)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            result = json;
        });
    const usersLis = document.getElementById('serviceList');
    const data = [];
    if (result.deployments.length > 0) {
        result.deployments.map((product, key) => {
            data.push(
                '<div class="card" style="width: 18rem;">' +
                '<div class="card-body">'
                + `<h5 class="card-title">${product}</h5>` +
                `<h6>Game server</h6>` +
                `<a href="#" >${result.services[key]}</a>` +
                `<h6></h6>` +
                `<h6>FTP server</h6>` +
                `<a href="#" >${result.services[key].substring(0, result.services[key].length - 5)}21</a>` +
                `<p class="card-text"></p>` +
                `<button id="button" onclick="deleteDeployment('${product}')" class="btn btn-danger">Delete</button>` +
                `<a href="#" onclick="log('${product}')" class="btn btn-primary">Log</a>` +
                '</div>' +
                '</div>');
        })
    }
    else {
        data.push("<h5>You doesn't have deployment<h5>");
    }
    usersLis.innerHTML = data
}

const urser = async () => {
    let result = null;
    let fetchData = {
        method: 'GET'
    }
    await fetch('/user/user', fetchData)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            localStorage.setItem('user', JSON.stringify(json.user));
            if (json.user.userNamespace !== null) {
                service(json.user.userNamespace);
            }
        });
}


urser();