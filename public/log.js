const getLog = async () => {
    const name = localStorage.getItem('log');
    let result;
    let fetchData = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            deployment_name: name
        })
    }
    try {

        await fetch('/orders/serverLogs', fetchData)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                console.log(json);
                const usersLis = document.getElementById('serviceList');
                const data = [];
                console.log(result);
                json.logs.map((item) => {
                    data.push(
                        `<p>${item}</p>`);
                })
                usersLis.innerHTML = data
            });
    } catch (err) {
        console.log(err);
    }

}

const refresh = () => {
    window.location.reload();
}
getLog();
