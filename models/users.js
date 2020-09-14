const mongoose = require('mongoose');

userModel = mongoose.model('Users', {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    password: String,
    guestBook: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "GuestBook",

    }]
})

module.exports = userModel