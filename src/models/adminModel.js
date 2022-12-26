const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    adminEmail: {
        type: String,
        required: true,
        unique: true
    },
    adminPassword: {
        type: String,
        required: true,
    }
}, { timestamps: true })

module.exports = mongoose.model('Admin', adminSchema)
