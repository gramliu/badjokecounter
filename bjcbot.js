function save(data) {
    fs.writeFileSync(fn, JSON.stringify(json), (err) => {
        if (err) throw err;
        console.log("Error saving file!");
    });
}
    

var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

var fs = require('fs')
var fn = "data.json";
var jstr = fs.readFileSync(fn);
var json = JSON.parse(jstr);

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
var badjokes = []
bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
        var args = message.split(' ');
        var cmd = args[0].substring(1);
        var user = message.substring(cmd.length + 2).split(' ')[0];
        switch(cmd) {
            case 'badjoke':
            if (!(user in json)) {
                json[user] = 0;
            }
            json[user]++;
            save(json);
            bot.sendMessage({
                to: channelID,
                message: user + ' BadJokes++; Current count: ' + json[user]
            });
            break;
        }
    }
});