const bodyParser = require('body-parser');
const express = require('express');
const { Message, Comment } = require('./model/message');
const mongoose = require('mongoose');
const app = express();
const port = 8000;


mongoose.connect('mongodb://localhost/foro', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', async (req, resp) => {

    try {

        let messages = await Message.find();

        resp.render('index', { messages });

    } catch (error) {
        console.log('error', error);
        resp.render('500');
    }

});

app.post('/', async (req, resp) => {

    try {

        console.log('req.body', req.body);

        const { id, name, message } = req.body;

        if (id == 'input-0') {

            let _message = new Message();
            _message.name = name;
            _message.message = message;

            await _message.save()

            let messages = await Message.find();

            resp.redirect('/');

        } else {

            let messageId = id.split('-')[1];
            console.log('messageId:', messageId);

            let comment = new Comment();
            comment.name = name;
            comment.message = message;
            let commentSaved = await comment.save();
            let messageUpdated = await Message.findByIdAndUpdate(messageId, {
                $push: {
                    comments: commentSaved
                }
            })

            console.log('messageUpdated', messageUpdated);

            resp.redirect('/');

        }

    } catch (error) {
        
        let messages = await Message.find();

        resp.render('index', {
            messages,
            error: errorHandler(error)
        });
    }

}),

    app.get('*', (req, resp) => {
        resp.render('404');
    });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

function errorHandler(error) {

    console.log(JSON.stringify(error));

    if(error.name === 'ValidationError') {
        let msg = '';
        Object.keys(error.errors).forEach(key => {
            if(msg) msg += ', ';
            msg += error.errors[key].message;
        });
       return msg;
    }

    return error;

}