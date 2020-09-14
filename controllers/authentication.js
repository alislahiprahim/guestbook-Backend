const jwt = require('jsonwebtoken')

function authentication(req, resp, next) {

    if (!req.headers.authorization) {
        resp.status(401).send('unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]

    if (token === null) {
        resp.status(401).send('unauthorized request')
    }
    let payload = jwt.verify(token, 'secretKey')
    if (!payload) {
        resp.status(401).send('unauthorized request')
    }
    req.userId = payload.subject
    next()
}

module.exports = authentication