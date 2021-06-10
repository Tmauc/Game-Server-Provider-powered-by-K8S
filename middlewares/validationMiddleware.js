const jwt = require('jsonwebtoken')

exports.validJWTNeeded = (req, res, next) => {
    try {
        if (req.cookies.JWT === undefined) {
            return res.status(401).send({
                message: `No token saved in the cookies`,
            });
        } else {
            req.jwt = jwt.verify(req.cookies.JWT, process.env.JWT_SECRET);
            return next();
        }
    } catch (err) {
        return res.status(403).send({
            message: `An error has occurred: ${err}`,
        });
    }
};

exports.adminRoleRequired = (req, res, next) => {
    if (req.jwt.role === "ADMIN") {
        return next();
    } else {
        return res.status(403).send({
            message: "You need to have the admin role to use this api"
        });
    }
};

exports.userRoleRequired = (req, res, next) => {
    if (req.jwt.role === "USER") {
        return next();
    } else {
        return res.status(403).send({
            message: "You need to have the user role to use this api"
        });
    }
};