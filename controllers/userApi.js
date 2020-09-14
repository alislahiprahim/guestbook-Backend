const express = require('express'),
    mongoose = require('mongoose'),
    userModel = require('../models/users'),
    guestbookModel = require('../models/guestbook'),
    messageModel = require('../models/messages'),
    Authentication = require('./authentication'),
    jwt = require('jsonwebtoken')
router = express.Router();

router.post('/register', (req, resp) => {

    const { name, email, password } = req.body

    const user = new userModel({
        _id: mongoose.Types.ObjectId(),
        name,
        email,
        password
    })

    user.save((err, data) => {
        if (err) {
            resp.json({ message: 'error', err })
        } else {
            const payload = { subject: data._id }
            const token = jwt.sign(payload, 'secretKey')
            resp.json({ message: 'success', token })
        }

    })

})

router.post('/login', (req, resp) => {
    const { email, password } = req.body
    userModel.findOne({ email: email, password: password }).exec((err, user) => {

        if (err) {
            resp.json({ message: 'error', err })
        } else {
            const payload = { subject: user._id }
            const token = jwt.sign(payload, 'secretKey')
            resp.json({ message: 'success', token })
        }
    })
})

router.post('/createguestbook', Authentication, (req, resp) => {
    const { title, url } = req.body

    const Guestbook = new guestbookModel({
        _id: mongoose.Types.ObjectId(),
        url: url,
        title: title,
        userId: req.userId
    })

    Guestbook.save((err, data) => {
        if (err) {
            resp.json({ message: 'error', err })
        } else {

            userModel.findOne({ _id: req.userId }).exec((err, user) => {
                debugger
                user.guestBook.push(data._id)

                user.save((err, userdata) => {
                    err ? resp.json({ message: 'error', err }) : resp.json({ message: 'success', data })
                })
            })

        }
    })

})

router.post('/deleteguestbook', Authentication, (req, resp) => {
    const { guestbookId } = req.body
    debugger
    guestbookModel.findOneAndDelete({ _id: guestbookId }).exec((err, data) => {
        err ? resp.json({ message: 'error', err }) : resp.json({ message: 'success', data })
    })
})

router.post('/addmessage', (req, resp) => {
    const { name, email, body, guestbookId } = req.body

    const message = new messageModel({
        _id: mongoose.Types.ObjectId(),
        name,
        email,
        body,
        guestbookId
    })

    message.save((err, data) => {
        if (err) {
            resp.json({ message: 'error', err })

        } else {
            guestbookModel.findOne({ _id: guestbookId }).exec((err, guestbook) => {
                debugger
                guestbook.messages.push(data._id)

                guestbook.save((err, gbdata) => {
                    err ? resp.json({ message: 'error', err }) : resp.json({ message: 'success', data })
                })
            })
        }
    })

})

router.get('/getallGuestbooks', (req, resp) => {

    guestbookModel.find({}).populate('messages').exec((err, data) => {

        err ? resp.json({ message: 'error', err }) : resp.json({ message: 'success', data })

    })
})


router.get('/myprofile', Authentication, (req, resp) => {
    userModel.findOne({ _id: req.userId }).populate
        ({
            path: 'guestBook', model: 'GuestBook'
            , populate: { path: 'messages', model: 'Messages' }
        })
        .exec((err, data) => {
            err ? resp.json({ message: 'error', err }) : resp.json({ message: 'success', data })
        })
})


router.post('/deletemessage', Authentication, (req, resp) => {
    messageModel.findOneAndDelete({ _id: req.body.mid }).exec((err, data) => {
        err ? resp.json({ message: 'error', err }) : resp.json({ message: 'success', data })
    })
})


router.post('/updateGb', Authentication, (req, resp) => {
    const { gbid, title, url } = req.body
    guestbookModel.updateOne({ _id: gbid }, { title: title, url: url }).exec((err, data) => {
        err ? resp.json({ message: 'error', err }) : resp.json({ message: 'success', data })
    })
})
module.exports = router