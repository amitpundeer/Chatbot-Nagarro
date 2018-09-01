const restify = require('restify');
const builder = require('botbuilder');
const _ = require('lodash');
const moment = require('moment');

// setup restify Server
const port = process.env.port || process.env.PORT || 5000;
const server = restify.createServer();
server.listen(port, () => {
    console.log('Bot is listening to %s', port);
});

// create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// listen for messages from users (channel)
server.post('/api/messages', connector.listen());

//send message
const bot = new builder.UniversalBot(connector, [
    session => {
        session.beginDialog('greeting');
    }
]);

// create greeting dialog
bot.dialog('greeting', [
    (session, results, next) => {
        const message = session.message.text.toLowerCase();
        if (message === 'hello') {
            session.endDialog('Hello, gald to see you.');
        } else if (message === 'good morning') {
            session.endDialog('Good morning, How are you?');
        } else if (message === 'adios') {
            session.endDialog('adios amigo');
        } else if (_.includes(message, 'search')) {
            session.beginDialog('searchFlight');
            next();
        } else {
            session.endDialog('Can you please repeat?');
        }
    },
    session => {
        session.endConversation();
    }
]);

var data = {};
// search flight

var weatherdata = {
    "delhi": "raining",
    "chandigarh":"sunny",
    "mumbai":"cloudy",
    "arga": "Hot"
};

bot
    .dialog('currentweather', [
        session => {
            builder.Prompts.text(session, 'Please enter city');
        },
        (session, results) => {
            let temp = weatherdata[results.response] ;
            session.endDialog(
                `The weather is **${temp}**`
            );
        },
        session => {
            session.endConversation();
        }
    ])
    .triggerAction({
        matches: /^(search|find|show|current)\s.*weather/i
    });

bot
    .dialog('searchFlight', [
        session => {
            builder.Prompts.text(session, 'Please enter departure city');
        },
        (session, results) => {
            data.depCity = results.response;
            builder.Prompts.text(session, 'Please enter arrival city');
        },
        (session, results) => {
            data.arrivalCity = results.response;
            builder.Prompts.time(session, 'Please enter arrival date');
        },
        (session, results) => {
            data.date = builder.EntityRecognizer.resolveTime([results.response]);
            session.endDialog(
                `Departure city = **${data.depCity}**, Arrival city = **${
                data.arrivalCity
                }**, Date = **${data.date}**`
            );
        }
    ])
    .triggerAction({
        matches: /^(search|find)\s.*flight/i
    });


