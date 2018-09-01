const restify = require('restify');
const builder = require('botbuilder');

// setup restify Server
const server = restify.createServer();
const port = process.env.port || process.env.PORT || 5000;
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
        if(session.message.text ==='Hello')
            session.send('Hello! I am your bot!')
        else if (session.message.text === 'Hey')
            session.send('Hey! I am your bot!')
        else if (session.message.text === 'Hola')
            session.send('Hola! I am your bot!');
        else
            session.send('I am your bot! :D');
    }
]);
