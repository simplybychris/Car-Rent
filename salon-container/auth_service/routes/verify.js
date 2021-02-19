const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //get token
    const token = req.cookies.token;
    //check if token if token exists
    if (!token) {
        return res.status(401).send('Unauthorized: No token provided');
    } else {
        //verification of tokens
        // const verified = jwt.verify(token, process.env.TOKEN);
        jwt.verify(token, process.env.TOKEN, function (err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                // req.user = verified;
                req.email = decoded.email;
                next();
            }
        });
    }
}