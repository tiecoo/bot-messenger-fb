'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am Tiecoos chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})


app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
    res.sendStatus(200);
});

const token = "EAAIM2gyEGTYBAJmr1302WOujRbB2TmcnbSzK1Q8RwG37mWp9LlEYwIlZCV0buoP7bnso8kJRiKWoAZBRvWk0kZCh188QNPRzQg50UjfJ1CXAMtG8uXRGHSERLFAMWUC53JwIxmagiZAmH9cWD67yL3a2QBA8l51SIvaxydOYIQZDZD"

function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: "EAAIM2gyEGTYBAJmr1302WOujRbB2TmcnbSzK1Q8RwG37mWp9LlEYwIlZCV0buoP7bnso8kJRiKWoAZBRvWk0kZCh188QNPRzQg50UjfJ1CXAMtG8uXRGHSERLFAMWUC53JwIxmagiZAmH9cWD67yL3a2QBA8l51SIvaxydOYIQZDZD"},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})