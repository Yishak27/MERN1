const express = require('express')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express()
dotenv.config({
    path: "config.env"
})
app.use(express.json({ extended: false }))
app.use(cors());
const port = process.env.PORT;

app.use((req, res, next)=>{
    console.log(`Url Request is ${req.method} and end point of ${req.url}`);
    next()
});
app.use('/API/user', require('./routes/api/user'));
app.use('/API/auth', require('./routes/api/auth'));
app.use('/API/profile', require('./routes/api/profile'));
app.use('/API/posts', require('./routes/api/posts'));

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true },
    (err => {
        if (err) {
            console.log("error on db connection",err);
        } else {
            console.log("connected to db");
        }
    }))

//handlling all bad requiest
app.use('/*', (req, res) => {
    return res.status(400).send({ msg: "No more response" })
})

app.listen(port, () => console.log(`listening on port ${port}!`))