const { response } = require('express');

var Middleware = {
    isAuthenticated: (req, res, next) => {
        const jwt = require('jsonwebtoken');
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ auth: false, message: 'No authorized.' });
        }
        jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if (err) {
                return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
            }
            next();
        });
    },
    ok: (res, data = null) => {
        res.json({
            response: {
                code: 200,
                message: 'success'
            },
            data: data
        });
    },
    error: (res, code, message) => {
        res.status(code).json({
            response: {
                code: code,
                message: message
            }
        });
    }
};

module.exports = Middleware;