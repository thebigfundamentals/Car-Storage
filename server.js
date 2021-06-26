const { response } = require('express');
const express = require('express');
const bodyParser = require('body-parser');
const Datastore = require('nedb');
const app = express();
const port = process.env.PORT || 3000;


app.listen(port, function () {
    console.log(`Server running at ${port}`)
});

app.use(express.static('frontend'));

app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();


// app.get('/login', (req, res) => {
//     res.sendFile(__dirname + '/frontend/carshop.html');
// });

// app.post('/login', (req, res) => {
//     let username = req.body.username;
//     let password = req.body.password;
//     res.send(`Username: ${username} Password: ${password}`);
// });


app.get('/api', (req, res) => {
    database.find({}, (err, data) => {
        console.log(data);
        res.json(data);
    })
});

app.post('/api', (req, res) => {
    const data = req.body;
    database.insert(data)
    console.log(data);
    res.json({
        status: 'Carro cadastrado com sucesso',
        data
    });
});

app.post('/removeApi', (req, res) => {
    const data = req.body;
    database.remove({ id: data.id }, {}, function (err, numRemoved) {
    });
    res.json({
        status: 'Carro excluído com sucesso',
        data
    });

});

/* LOGIN SETTINGS */

const expressSession = require('express-session')({
    secret: 'asdASFasd84561',
    resave: false,
    saveUninitialized: false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb+srv://admin:vp30712@cluster0.xrzme.mongodb.net/usersDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;
const UserDetail = new Schema({
    username: String,
    password: String
});

UserDetail.plugin(passportLocalMongoose);
const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');

/* PASSPORT LOCAL AUTHENTICATION */

passport.use(UserDetails.createStrategy());

passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());

/* LOGIN ROUTES */

const connectEnsureLogin = require('connect-ensure-login');

app.post('/login', (req, res, next) => {
    passport.authenticate('local',
        (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.redirect('/login?info=' + info);
            }

            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }

                return res.redirect('/carshop');
            });

        })(req, res, next);
});

app.get('/login',
    (req, res) => res.sendFile('frontend/index.html',
        { root: __dirname })
);

app.get('/carshop',
    connectEnsureLogin.ensureLoggedIn(),
    (req, res) => res.sendFile('frontend/carshop.html', { root: __dirname })
);

app.get('/user',
    connectEnsureLogin.ensureLoggedIn(),
    (req, res) => res.send({ user: req.user })
);

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

// UserDetails.register({ username: 'paul', active: false }, 'paul');
// UserDetails.register({ username: 'jay', active: false }, 'jay');
// UserDetails.register({ username: 'roy', active: false }, 'roy');
// UserDetails.register({ username: 'timduncan@goat.com', active: false }, 'spurs');