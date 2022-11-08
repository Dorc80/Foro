const mongoose = require('mongoose');

const CommentScheme = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    message: {
        type: String,
        required: [true, 'El mensaje es requerido']
    },
});

const MessageScheme = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    message: {
        type: String,
        required: [true, 'El mensaje es requerido']
    },
    comments: [CommentScheme]
});

module.exports = { 
    Message: mongoose.model('Message', MessageScheme),
    Comment: mongoose.model('Comment', CommentScheme)
}