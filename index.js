const express = require('express');
const app = express();
const config = require('./config');
const db = require('./dbConnect')
const path = require('path')
const cookieParser = require('cookie-parser');

db.connect((error) => {
    if (error)
        console.log('error', error)
    else
        console.log('MySQL database connected !')
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use('/user', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/admins', require('./routes/admin'));
app.use('/orders', require('./routes/order'));
app.use('/user', require('./routes/user'));

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.set('view engine', "hbs")

//Application pages
app.get('/login', (req, res) => {
    res.render("login")
});
app.get('/', (req, res) => {
    res.render("login")
});
app.get('/home', (req, res) => {
    res.render("home")
});
app.get('/shop', (req, res) => {
    res.render("shop")
});
app.get('/register', (req, res) => {
    res.render("register")
});
app.get('/loginAdmin', (req, res) => {
    res.render("loginAdmin")
});
app.get('/homeAdmin', (req, res) => {
    res.render('homeAdmin')
})
app.get('/users', (req, res) => {
    res.render('usersAdmin')
})
app.get('/user', (req, res) => {
    res.render('userAdmin')
})

app.get('/logUser', (req, res) => {
    res.render('logUser')
})
app.listen(config.port, '0.0.0.0', () => console.log(`app listening on port ${config.port}!`));
