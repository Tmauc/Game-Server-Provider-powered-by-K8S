let result = {};

const getShop = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user.userNamespace === null) {
        const shop = document.getElementById('shop');
        const data = [];
        data.push(
            '<li class="item">' +
            'Buy a namespace' +
            `<button type="button" id="buttonNamespace" onclick="buyNameSpace()" class="btn btn-primary">Buy Namespace</button>` +
            '</li>');
        shop.innerHTML = data
    } else {
        let result = {};
        let fetchData = {
            method: 'GET'
        }
        await fetch('/products/products', fetchData)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                result = json.products;
                console.log(result)
            });
        const shop = document.getElementById('shop');
        const data = [];
        if (result !== undefined) {
            result.map((product) => {
                data.push(
                    '<li class="item">'
                    + product.name +
                    `<button type="button" id="button" onclick=buyProduct('${product.type}') class="btn btn-primary">Buy product</button>` +
                    '</li>');
            })
            shop.innerHTML = data
        }
    }
}
getShop();