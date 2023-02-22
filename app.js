const express = require('express')
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express()
dotenv.config({
    path: "config.env"
})
app.use(express.json({ extended: false }))

const port = process.env.PORT;

app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true },
    (err => {
        if (err) {
            console.log("error on db connection");
        } else {
            console.log("connected to db");
        }
    }))

app.listen(port, () => console.log(`listening on port ${port}!`))