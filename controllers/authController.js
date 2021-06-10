const db = require('../dbConnect')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.registerUser = function (req, res) {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "Bad arguments 'name', 'email' or 'password'",
        });
    }
    const { name, email, password } = req.body;

    db.query('SELECT email from users WHERE email = ?', [email], async (error, result) => {
        if (error) {
            console.log("error =", error);
            return res.status(400).send({
                message: `An error has occurred: ${error}`
            });
        }
        if (result.length > 0) {
            return res.status(400).send({
                message: "That email is already used",
            });
        } else {
            let hashedPassword = await bcrypt.hash(password, 8);
            db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, result) => {
                if (error) {
                    return res.status(400).send({
                        message: `An error has occurred: ${error}`,
                    });
                } else {
                    res.status(200).redirect('/login');
                }
            })
        }
    })
}

exports.connectUser = async function (req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({
                message: "Bad arguments 'email' or 'password'",
            });
        }
        db.query("SELECT * FROM users WHERE email = ?", [email], async (error, result) => {
            if (error) {
                return res.status(400).send({
                    message: `An error has occurred: ${error}`,
                });
            }
            if (!result[0] || !(await bcrypt.compare(password, result[0].password))  ) {
                return res.status(401).send({
                    message: `Bad email or password`,
                    value: false
                });
            } else {
                const id = result[0].id;
                const role = result[0].role;
                const token = jwt.sign({id, role}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                })
                const cookieOption = {
                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                res.cookie('JWT', token, cookieOption)
                res.status(200).redirect('/home');
            }
        })

    } catch (err) {
        console.log("error =", err);
        return res.status(400).send({
            message: `An error has occurred: ${err}`,
        });
    }
}