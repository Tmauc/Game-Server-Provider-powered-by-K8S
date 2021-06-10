const db = require('../dbConnect')

exports.newProduct = function (req, res) {
    if (!req.body.name || !req.body.description) {
        res.status(400).send({
            message: "Bad arguments 'name' or 'description'",
        });
    }
    const { name, description } = req.body;

    db.query('SELECT name from products WHERE name = ?', [name], async (error, result) => {
        if (error) {
            console.log("error =", error);
            res.status(400).send({
                message: `An error has occurred: ${error}`
            });
        }
        if (result.length > 0) {
            res.status(400).send({
                message: "That name is already used",
            });
        } else {
            db.query('INSERT INTO products SET ?', { name: name, description: description }, (error, result) => {
                if (error) {
                    console.log("error =", error);
                    res.status(400).send({
                        message: `An error has occurred: ${error}`,
                    });
                } else {
                    res.status(200).send({
                        message: "Product successfully added",
                    });
                }
            })
        }
    })
}

exports.getProducts = async function (req, res) {
    db.query("SELECT * FROM products", async (error, result) => {
        if (error) {
            return res.status(400).send({
                message: `An error has occurred: ${error}`,
            });
        }
        return res.status(200).send({
            products: result,
        });

    })
}

exports.getProduct = async function (req, res) {
    try {
        const { name, id } = req.body;
        if (!name && !id) {
            return res.status(400).send({
                message: "Bad arguments 'name' or 'id'",
            });
        }
        let search;
        let elementToSearch;

        if (name) {
            search = "SELECT * FROM products WHERE name = ?"
            elementToSearch = name;
        }
        else if (id) {
            search = "SELECT * FROM products WHERE id = ?"
            elementToSearch = id;
        }

        db.query(search, [elementToSearch], async (error, result) => {
            if (error) {
                return res.status(400).send({
                    message: `An error has occurred: ${error}`,
                });
            }
            if (!result[0]) {
                return res.status(401).send({
                    message: `Bad name or id`,
                    value: false
                });
            } else {
                const name = result[0].name;
                const description = result[0].description;
                const id = result[0].id;

                return res.status(200).send({
                    name: name,
                    description: description,
                    id: id
                });
            }
        })

    } catch (err) {
        console.log("error =", err);
        res.status(400).send({
            message: `An error has occurred: ${err}`,
        });
    }

}