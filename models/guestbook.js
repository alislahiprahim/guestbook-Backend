const mongoose = require('mongoose')

guestbookModel = mongoose.model('GuestBook', {
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    url: String,
    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    }],
     messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages",
    }]
})

module.exports = guestbookModel