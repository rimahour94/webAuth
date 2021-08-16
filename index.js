const express = require("express")
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
const path = require('path')
const { parse } = require("path")
const joi = require("@hapi/joi")
const { array } = require("@hapi/joi")
const bcrypt = require("bcrypt")



// Forn ejs engine
app.set('view engine', 'ejs')

// add style into the file

app.use('/style', express.static(path.join(__dirname, 'style')))


// BodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Redirect Pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "files", "home.html"))
})
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, "files", "login.html"))
})
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, "files", "register.html"))
})
app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, "files", "home.html"))
})
app.listen(3000)


// Database

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: "webAuth",

})

connection.connect((err) => {
    if (!!err) {
        console.log(err)
    }
    else {
        console.log('connected')
    }
})

app.post('/register.html', (req, res) => {
    let hashPass = bcrypt.hashSync(req.body.password, 14)
    // console.log(hashPass)
    const sql = `INSERT into user SET?`;
    const data = {
        name: `${req.body.name}`,
        email: `${req.body.email}`,
        password: `${hashPass}`,
        phNumber: `${req.body.phNumber}`
    }

    connection.query(sql, data, (err, result) => {
        const parsed = JSON.parse(JSON.stringify(data))
        //    console.log(parsed,"parsed data")
        if (err) {
            let errr = "Somthing went wrong"
        }
        else {
            console.log("successfully sent data into DB")
            // console.log()
            res.render("dashboard", [dataa = parsed])
        }
    })
})

app.post('/login.html', (req, res) => {
    const slct_all = `SELECT * from user;`
    // const slct_data=`SELECT * from user WHERE password="${req.body.password}" AND email="${req.body.email}"`;
    connection.query(slct_all, (err, result) => {
        if (err) {
            let errr = "something went wrong"
        }
        else {
            console.log(result, "result")
            var bool;
            var verifyUser;
            result.forEach(element => {
                verifyUser = JSON.parse(JSON.stringify(element))

                if (verifyUser.email === req.body.email && bcrypt.compareSync(req.body.password, verifyUser.password)) {
                    res.render('dashboard', [dataa = verifyUser])
                    bool = true
                }
                if (verifyUser.email != req.body.email || verifyUser.password != req.body.password) {
                    bool = false
                }

            });
            if (!bool) {
                res.render('login', [er = "incorrect email/password"])
            }
        }


    })

})