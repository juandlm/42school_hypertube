require('dotenv').config();

global.env = process.env.NODE_ENV
const express = require('express');
const mongoose = require('../config/database');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('./middleware/passport')
const cookieParser = require("cookie-parser")

const app = express();

const authRouter = require('./routers/auth');
const userRouter = require('./routers/user');
const filmRouter = require('./routers/film');

const filmController = require('./controllers/film');

mongoose.connection.then(
    () => {
        console.log('Connected to the DB')
    },
    err => {
        console.log('Cannot connect to the DB', err)
    }
);


app.use(express.static(path.join(__dirname, 'src')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require('morgan')('combined'));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

filmController.cronFilms();

app.use('/api/oauth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/film', passport.authenticate('jwt', {
    session: false
}), filmRouter)

app.get("/getSub/:lang/:dir/:file", (req, res) => {
    const lang = req.params.lang
    const dir = req.params.dir
    const file = req.params.file
    const dst = path.resolve(__dirname, '..', 'public/subtitle/' + lang + '/' + dir + '/' + file)
    res.setHeader('Content-type', 'text/vtt');
    res.sendFile(dst);
});

app.get('/', (req, res) => {
    res.json({
        "Hypertube": "Stream movies VERY legally"
    });
});

// handle 404 error
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// handle errors
app.use((err, req, res, next) => {
    console.log(err);

    if (err.status === 404)
        res.status(404).json({
            message: "Not found"
        });
    else
        res.status(500).json({
            message: "Something looks wrong"
        });
});




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});