const db = require('../dbConnect')
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

exports.getUser = function (req, res) {
    const user_id = req.jwt.id;
    if (!user_id) {
        res.status(400).send({
            message: "Bad arguments 'name' or 'description'",
        });
    }

    db.query('SELECT * from users WHERE id = ?', [user_id], async (error, result) => {
        if (error) {
            console.log("error =", error);
            res.status(400).send({
                message: `An error has occurred: ${error}`
            });
        }
        if (result.length < 0) {
            res.status(400).send({
                message: `No user`,
            });
        }
        res.status(200).send({
            user: result[0]
        });
    })
}

exports.deleteUser = async function (req, res) {
    if (!req.body.id) {
        res.status(400).send({
            message: "User_id is undefined",
        });
    }

    const { id } = req.body;
    
    try {
        db.query('SELECT * from users WHERE id = ?', [id], async (error, result) => {
            if (error) {
                return res.status(400).send({
                    message: `An error has occurred: ${error}`
                });
            }
            if (result.length < 0) {
                return res.status(400).send({
                    message: "The user does not exist",
                });
            }

            const string = JSON.stringify(result[0]);
            const json = JSON.parse(string);
            const namespace_name = json.userNamespace;
            
            if (namespace_name !== null)
                await exec('cd Server && ' + 'kubectl --kubeconfig .kube/config.yaml delete namespaces ' + namespace_name);
            
            db.query("DELETE FROM users WHERE id = ?", [id], (error, result) => {
                if (error) {
                    res.status(400).send({
                        message: `An error has occurred: ${error}`,
                    });
                }
            })
            res.status(200).send({
                message: "User successfully delete",
            });
        });
    }
    catch(error) {
        res.status(400).send({
            message: `An error has occurred: ${error}`,
        });
    }
}