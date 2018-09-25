const User = require('../models/User')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const encrypt = require('../helpers/encrypt')
const {register} = require('../helpers/sendMail')

class Controller {

    static sendEmailRegister() {

    }

    static loginFb(req, res) {
        let url = `https://graph.facebook.com/me?fields=id,name,email&access_token=${req.body.token_fb}`

        axios({
            method: 'get',
            url: url
        })
            .then(response => {
                User.find({email: response.data.email}, (err, data) => {
                    if (err) {
                        res.status(500).json({error: err})
                    } else {
                        if (data.length === 0) {
                            register(response.data.email, response.data.name)
                            
                            let newUser = new User({
                                fb: true,
                                name: response.data.name,
                                email: response.data.email,
                                password: '      '
                            })

                            newUser.save((err, user) => {
                                if (err) {
                                    res.status(500).json({error: err})
                                } else {
                                    let obj = {
                                        id: user._id,
                                        name: user.name,
                                        email: user.email
                                    }

                                    jwt.sign(obj, process.env.JWT_SECRET, (err ,token) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            res.status(200).json(token)
                                        }
                                    })
                                }
                            })
                        } else {
                            let obj = {
                                id: data[0]._id,
                                name: data[0].name,
                                email: data[0].email
                            }

                            jwt.sign(obj, process.env.JWT_SECRET, (err ,token) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    res.status(200).json(token)
                                }
                            })
                        }
                    }
                })
            })
            .catch(err => {
                res.status(500).json({error: err.response.data.error.message})
            })
    }

    static getUser(req, res) {
        res.status(200).json(req.decoded)
    }

    static register (req, res) {
        let newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }

        User.create(newUser)
            .then(() => {
                register(req.body.email, req.body.name)
                res.status(201).json({message: 'User created!'})
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }

    static login(req, res) {
        let hashed = encrypt.hashPassword(req.body.password, req.body.email)

        User.findOne({email: req.body.email, password: hashed})
            .then(user => {
                let obj = {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }

                jwt.sign(obj, process.env.JWT_SECRET, (err, token) => {
                    if (err) {
                        res.status(500).json(err)
                    } else {
                        res.status(200).json(token)
                    }
                })
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }

}

module.exports = Controller