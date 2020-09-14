const mongoose = require('mongoose')

messagesModel = mongoose.model('Messages', {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    body: String,
    guestbookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GuestBook",
    }
})

module.exports = messagesModel