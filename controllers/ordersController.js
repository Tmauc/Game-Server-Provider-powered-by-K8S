const db = require('../dbConnect')

exports.order = function (req, res) {
    let products;
    const user_id = req.jwt.id;
    if (!req.body.id || !user_id) {
        res.status(400).send({
            message: "Bad arguments 'name' or 'description'",
        });
    }

    const {id} = req.body;

    db.query('SELECT * from products WHERE id = ?', [id], async (error, result) => {
        if (error) {
            console.log("error =", error);
            res.status(400).send({
                message: `An error has occurred: ${error}`
            });
        }
        if (result.length <= 0) {
            res.status(400).send({
                message: `No product named id of ${id}`,
            });
        }
        products = JSON.parse(JSON.stringify(result))
        db.query('SELECT * from users WHERE id = ?', [user_id], async (error, result) => {
            if (error) {
                console.log("error =", error);
                res.status(400).send({
                    message: `An error has occurred: ${error}`
                });
            }
            let my_product_user = JSON.parse(JSON.stringify(result))
            if (result.length <= 0) {
                res.status(400).send({
                    message: "That user id dosent existe ",
                });
            } else {
                let value = JSON.parse(my_product_user[0].userProduct)
                if (value !== null && value.find(id => id.id === products[0].id)) {
                    res.status(400).send({
                        message: `Item alrady buy !`
                    });
                    return;
                }
                if (value !== null) {
                    value.push({
                        name: products[0].name,
                        id: products[0].id
                    })
                } else {
                    value = [{
                        name: products[0].name,
                        id: products[0].id
                    }]
                }
                db.query("UPDATE users SET userProduct = ?  WHERE id = ?", [JSON.stringify(value), user_id], (error, result) => {
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

    })
}