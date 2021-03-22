const express = require('express');
const ENV = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient
const MONGOdb = process.env.MONGO
const optionsMongo = { useNewUrlParser: true, useUnifiedTopology: true }
const md5 = require('md5')
const jwt = require('jsonwebtoken');
let token = jwt.sign({ foo: 'bar' }, 'shhhhh');

const server =  express()
const listenPort = process.env.PORT || 8080;

server.use(express.urlencoded({extended:false}));
server.use(express.json());

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

// -------------------------------------------------SIGNUP

server.post('/signup', (req, res) => {
    const USER = {
        email: req.body.email,
        pass: md5(req.body.pass)
    }

    MongoClient.connect(MONGOdb, optionsMongo, (err, db) => {
        try {
            db.db("signup")
                .collection("users")
                .insertOne(USER, (err, result) => {
                    if (err){
                        res.status(400).json({
                            data: err,
                            ok: false,
                          })
                          db.close()
                    } else {
                        res.send("User was added correctly")
                        db.close()
                    }
                })
    
        } catch {
            console.log(err);
            res.status(500).json({
              data: err,
              ok: false,
            })
        }
    })
})

// -------------------------------------------------DELETE

server.delete('/delete', (req, res) => {
    const USER = {
        email: req.body.email,
        pass: md5(req.body.pass)
    }
    let token = jwt.sign({email: USER.email}, md5(process.env.SECRET))
    console.log(token);
    const TOKENfront = String(req.headers.authorization)
    console.log(TOKENfront);

    if (token === TOKENfront){
        MongoClient.connect(MONGOdb, optionsMongo, (err, db) => {
            try {
                db.db("signup")
                    .collection("users")
                    .deleteOne(USER, (err, result) => {
                        if (result.deletedCount === 0){
                            res.status(400).json({
                                data: "User already does not exist",
                                ok: false,
                            })
                            db.close()
                        } else {
                            res.send("User was deleted correctly")
                            db.close()
                        }
                    })
        
            } catch {
                // console.log(err);
                res.status(500).json({
                data: err,
                ok: false,
                })
            }
        })
    } else {
        res.status(401).json({
            data: "Unauthorized",
            ok: false,
          })
    }
})

// -------------------------------------------------LOGIN

server.post('/login', (req, res) => {
    const USER = {
        email: req.body.email,
        pass: md5(req.body.pass)
    }

    MongoClient.connect(MONGOdb, optionsMongo, (err, db) => {
        try {
            db.db("signup")
                .collection("users")
                .findOne(USER, (err, result) => {
                    if (result == null){
                        res.status(401).json({
                            data: "Password do not match",
                            ok: false,
                          })
                          db.close()
                    } else {
                        // console.log(result)
                        let token = jwt.sign({email: USER.email}, process.env.SECRET, {algorithm: 'RS256'})
                        console.log(token);
                        res.send(token)
                        db.close()
                    }
                })
    
        } catch {
            console.log(err);
            res.status(500).json({
              data: err,
              ok: false,
            })
        }
    })
})