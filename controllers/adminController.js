const db = require('../dbConnect')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.registerAdmin = function (req, res) {
    if (!req.body.name || !req.body.email || !req.body.password) {
        res.status(400).send({
            message: "Bad arguments 'name', 'email' or 'password'",
        });
    }
    const { name, email, password } = req.body;

    db.query('SELECT email from admins WHERE email = ?', [email], async (error, result) => {
        if (error) {
            console.log("error =", error);
            res.status(400).send({
                message: `An error has occurred: ${error}`
            });
        }
        if (result.length > 0) {
            res.status(400).send({
                message: "That email is already used",
            });
        } else {
            let hashedPassword = await bcrypt.hash(password, 8);
            db.query('INSERT INTO admins SET ?', { name: name, email: email, password: hashedPassword }, (error, result) => {
                if (error) {
                    console.log("error =", error);
                    res.status(400).send({
                        message: `An error has occurred: ${error}`,
                    });
                } else {
                    res.status(200).send({
                        message: "Admin successfully added",
                    });
                }
            })
        }
    })
}

exports.connectAdmin = async function (req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({
                message: "Bad arguments 'email' or 'password'",
            });
        }
        db.query("SELECT * FROM admins WHERE email = ?", [email], async (error, result) => {
            if (error) {
                return res.status(400).send({
                    message: `An error has occurred: ${error}`,
                });
            }
            if (!result[0].email || !(await bcrypt.compare(password, result[0].password))) {
                return res.status(401).send({
                    message: `Bad email or password`,
                    value: false
                });
            } else {
                const id = result[0].id;
                const role = result[0].role;
                const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                })
                const cookieOption = {
                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                res.cookie('JWT', token, cookieOption)
                res.status(200).redirect('/users');
            }
        })

    } catch (err) {
        console.log("error =", err);
        res.status(400).send({
            message: `An error has occurred: ${err}`,
        });
    }
}

exports.getUsers = async function (req, res) {
    db.query("SELECT * FROM users ", async (error, result) => {
        if (error) {
            return res.status(400).send({
                message: `An error has occurred: ${error}`,
            });
        }
        if (!result[0]) {
            return res.status(400).send({
                message: `No users to display`,
                value: false
            });
        } else {
            return res.status(200).send({
                users: result
            });
        }
    })
}

exports.getUser = async function (req, res) {
    console.log('body =', req.body);
    const { id } = req.body;
    if (!id) {
        return res.status(400).send({
            message: "bad id",
        });
    }
    db.query("SELECT * FROM users WHERE id = ? ", [id], async (error, result) => {
        if (error) {
            return res.status(400).send({
                message: `An error has occurred: ${error}`,
            });
        }
        if (!result[0]) {
            return res.status(400).send({
                message: `Nos user to display`,
                value: false
            });
        } else {
            return res.status(200).send({
                users: result
            });
        }
    })
}