const jwt = require('jsonwebtoken');
//middle ware for authorization of the use by token
module.exports = (req, res, next) => {
    const token = req.header('x-access-token');
    const token_ex = process.env.JWT_TOKEN;
    console.log(token_ex);
    //check if the user have a token
    if (!token) {
        res.status(401).json({ msg: 'No Token is available' });
    }
    //if the user have token

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.send(err);
    }
}