const express = require('express');
const ENV = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient
const MONGOdb = process.env.MONGO
const optionsMongo = { useNewUrlParser: true, useUnifiedTopology: true }
const cors = require('cors')
const md5 = require('md5')
const jwt = require('jsonwebtoken');
const cryptoRS = require('crypto-random-string')

const server =  express()
const listenPort = process.env.PORT || 8080;

const staticFilesPath = express.static(__dirname + '/Public');
server.use(staticFilesPath);

server.use(express.urlencoded({extended:false}));
server.use(express.json());

server.use(cors())

// const corsOptions = {
//     origin: "*"
// }

// -------------------------------------LEVANTAR SERVIDOR

server.listen(listenPort,
    () => console.log(`Server started listening on ${listenPort}`))

//---------------------------------------------DB STATUS
/*  >MONGODB DATABASE CREATED
    >COLLECTION CREATED
    >UNIQUE INDEX CREATED: 
        db.collection
        .createIndex( <key and index type specification>, { unique: true } )
        (NOW EMAIL FIELD CANNOT BE REPEATED)
*/ 

// ---------------------------------------------VALIDATION

const emailIsValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  
const passIsValid = (pass) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pass)

// -------------------------------------------------SIGNUP

server.post('/signup', (req, res) => {
    const USER = {
        email: req.body.email,
        pass: md5(req.body.pass),
        secret: cryptoRS({length: 10, type: 'base64'})
    }

    if ( emailIsValid(USER.email) && passIsValid(req.body.pass) ) {
        MongoClient.connect(MONGOdb, optionsMongo, (err, db) => {
            try {
                db.db("signup")
                    .collection("users")
                    .insertOne(USER, (err, result) => {
                        if (err){
                            console.log("ocupado");
                            res.status(406)
                            db.close()
                        } else {
                            console.log("ok");
                            res.status(200)
                            db.close()
                        }
                    })
        
            } catch {
                res.status(500).json({
                    data: "There's a problem with the internal server. Try again later",
                    ok: false,
                })
            }
        })
    } else {
        res.status(406).json({
            data: "Email invalid / Pass must contain minimum eight characters, at least one letter and one number",
            ok: false,
          })
    }
})

// -------------------------------------------------LOGIN

server.get('/login', (req, res) => {
    const USER = {
        email: req.body.email,
        pass: md5(req.body.pass)
    }
    if ( emailIsValid(USER.email) && passIsValid(req.body.pass) ) {
        MongoClient.connect(MONGOdb, optionsMongo, (err, db) => {
            try {
                db.db("signup")
                    .collection("users")
                    .findOne(USER, (err, result) => {
                        if (result == null){
                            res.status(401).json({
                                data: "Password and email do not match",
                                ok: false,
                            })
                            db.close()
                        } else {
                            let secret = result.secret
                            let token = jwt.sign({email: USER.email}, secret, {expiresIn: 600})
                            res.send(token)
                            db.close()
                        }
                    })
            } catch {
                res.status(500).json({
                data: "There's a problem with the internal server. Try again later",
                ok: false,
                })
            }
        })
    } else {
        res.status(406).json({
            data: "Email invalid / Pass must contain minimum eight characters, at least one letter and one number",
            ok: false,
        })
    }
})

// -------------------------------------------------DELETE

server.delete('/delete', (req, res) => {
    try {
        let tokenArray = req.headers.authorization.split(" ")
        let decoded = jwt.decode(tokenArray[1])
        if (decoded.email) {
            MongoClient.connect(MONGOdb, optionsMongo, (err, db) => {
                db.db("signup")
                    .collection("users")
                    .findOne({email: decoded.email}, (err, result) => {
                        try {
                            let verified = jwt.verify(tokenArray[1], result.secret)
                            if (verified.email){
                                MongoClient.connect(MONGOdb, optionsMongo, (err, db) => {
                                    try {
                                        db.db("signup")
                                            .collection("users")
                                            .deleteOne({email: verified.email}, (err, result) => {
                                                res.send("User was deleted correctly")
                                                db.close()
                                            })
                                    } catch {
                                        res.status(500).json({
                                        data: "There's a problem with the internal server. Try again later",
                                        ok: false,
                                        })
                                    }
                                })
                            }
                        } catch {
                            res.status(401).json({
                                data: "You're not authorized to delete a user. Please try logging in again",
                                ok: false,
                            })
                        }
                    })   
                })
            }
    } catch {
        res.status(401).json({
            data: "You're not authorized to delete a user. Please try logging in again",
            ok: false,
            })
    }
})

// ----------------------------------------------READ PRIVATE

server.get('/private', (req, res) => {
    try {
        let tokenArray = req.headers.authorization.split(" ")
        let decoded = jwt.decode(tokenArray[1])
        // console.log(decoded);
        if (decoded.email) {
            MongoClient.connect(MONGOdb, optionsMongo, (err, db) => {
                try {
                    db.db("signup")
                    .collection("users")
                    .findOne({email: decoded.email}, (err, result) => {
                        try {
                            let verified = jwt.verify(tokenArray[1], result.secret)
                                if (verified.email) {
                                        res.send(result)
                                        db.close() 
                                    }
                            } catch {
                                res.status(401).json({
                                    data: "You're not authorized to see this content. Please try logging in again",
                                    ok: false,
                                })
                            }
                        })
                } catch {
                    res.status(500).json({
                        data: "There's a problem with the internal server. Try again later",
                        ok: false,
                    })
                }
            })
        }                 
    } catch {
        res.status(401).json({
            data: "You're not authorized to see this content. Please try logging in again",
            ok: false,
        })
    }
})

// ---------------------------------------------------LOGOUT


server.put('/logout', (req, res) => {
    try {
        let newSecret = cryptoRS({length: 10, type: 'base64'})
        let tokenArray = req.headers.authorization.split(" ")
        let decoded = jwt.decode(tokenArray[1])
        if (decoded.email) {
            MongoClient.connect(MONGOdb, optionsMongo, (err, db) => {
                try {
                    db.db("signup")
                        .collection("users")
                        .updateOne({email: decoded.email}, {$set: {secret: newSecret}}, (err, result) => {
                            if (err){
                                res.status(400, "Fatal error-- Humans must be destroyed")
                                db.close()
                            } else {
                                res.redirect(200, '/login')
                                db.close()
                            }
                        })
                } catch {
                    res.status(500).json({
                        data: "There's a problem with the internal server. Try again later",
                        ok: false,
                    })
                }
            })
        }             
    } catch {
        res.status(401).json({
            data: "You're already logged out",
            ok: false,
        })
    }
})