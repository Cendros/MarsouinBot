const env = require('dotenv');
const keyv = require('keyv');
const fs = require('fs');
const Discord = require('discord.js');
const keepAlive = require('./server');
const client = new Discord.Client({
	disableMentions: 'all',
});

client.commands = new Discord.Collection();
client.roleCommands = new Discord.Collection(); 
client.lolCommands = new Discord.Collection();
client.diversCommands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const roleCommandFiles = fs.readdirSync('./roleCommands').filter(file => file.endsWith('.js'));
const lolCommandFiles = fs.readdirSync('./lolCommands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.diversCommands.set(command.name, command);
	client.commands.set(command.name, command);
};

for (const file of roleCommandFiles) {
	const roleCommand = require(`./roleCommands/${file}`);
	client.roleCommands.set(roleCommand.name, roleCommand);
	client.commands.set(roleCommand.name, roleCommand);
};

for (const file of lolCommandFiles) {
	const lolCommand = require(`./lolCommands/${file}`);
	client.lolCommands.set(lolCommand.name, lolCommand);
	client.commands.set(lolCommand.name, lolCommand);
};

// config (DO NOT DELET)
token = process.env['token'];
if (!token) throw new Error('There must be a token inside the .env file! Make sure that you have created a .env file and defined the token variable with the correct bot token!')
client.database = new keyv('sqlite://./database.sqlite');
client.prefix = process.env['prefix'];
if (!client.prefix) throw new Error('Prefix must be defined in the .env file')
client.owners = ['254318300052324354']; // put your discord user ID in here. can be unlimited
colors = {
	red: '#da0000',
};
client.getUserFromMention = (mention) => {
	if (!mention) return;
	if (mention.startsWith('<@') && mention.endsWith('>')) {
			mention = mention.slice(2, -1);
			if (mention.startsWith('!')) {
					mention = mention.slice(1);
			};
			return client.users.cache.get(mention);
	};	
};

// error handling 
process.on('unhandledRejection', err => console.error(err));
client.on('error', err => console.error(err));

// when discord bot is ready 
client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}`);
	//console.log(`Invite Me! ${await client.generateInvite(8)}`)
});

client.on('message', async(message) => {
	if (message.author.bot) return;
	if(Math.floor(Math.random() * 20000) == 1) message.reply("Je trouve ça un peu cringe...");
	if(Math.floor(Math.random() * 19068840) == 1) message.reply("Bravo, tu as gagné au loto");
	if(Math.floor(Math.random() * 5000) == 1) message.channel.send("Ratio");
	if(client.owners.includes(message.author.id)) {
		if(message.content.startsWith("Bon anniversaire")) {
			let user = message.mentions.users.first();
			await sleep(1800000);
			return message.channel.send('Joyeux anniversaire ' + user.username + ' ! :tada:');
		}
	}
	
	if (!message.content.startsWith(client.prefix)) return;
	
	const args = message.content.slice(client.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return message.channel.send("Cette commande n'existe pas. Affichez la liste des commandes avec \`!mrs help\`");

	if (command.roleOnly && !message.member.roles.cache.has('882349034231189604') && !client.owners.includes(message.author.id)) {
		return message.channel.send("Vous ne pouvez pas m'utiliser :eyes:");
	}

	if (command.ownerOnly && !client.owners.includes(message.author.id)) {
		return message.channel.send(`Vous ne pouvez pas m'utiliser :eyes:`);
	}

	if (command.guildOnly && (message.channel.type == 'dm')) {
		return message.channel.send(`Cette commande ne fonctionne pas en DM !`);
	}

	try {
		command.run(client, message, args);
	} catch (error) {
		message.channel.send(`Il y a eu une erreur lors de l'exécution de la commande D: \`${error}\``)
	}
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

keepAlive();
client.login(token);