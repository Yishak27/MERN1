const jwt = require('jsonwebtoken');

//middle ware for authorization of the use by token
module.exports = (req, res, next) => {
    const token = req.header('x-access-token');
    const token_ex = process.env.JWT_TOKEN;
    //check if the user have a token
    if (!token) {
       return res.status(401).json({ msg: 'No Token is available' });
    }
    try {
        const decoded = jwt.verify(token, token_ex);
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.send("Unable to validate the token");
    }
}