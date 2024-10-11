const fs = require('node:fs');
const path = require('node:path');
const { Events, Client, Collection, GatewayIntentBits } = require('discord.js');
const { Player } = require("discord-player");
const { SoundCloudExtractor } = require("@discord-player/extractor");
const dotenv = require('dotenv');

// Set up environment variables
dotenv.config();
const TOKEN = process.env.TOKEN;

// Set up client
const client = new Client({ intents: [
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildVoiceStates,
] });

// Set up command collection
client.commands = new Collection();

// Register commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} 
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Set up events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => {
			if (event.name === Events.InteractionCreate) {
				event.execute(...args, player);
			} 
			else {
				event.execute(...args);
			}
		});
	} 
	else {
		client.on(event.name, (...args) => {
			if (event.name === Events.InteractionCreate) {
				event.execute(...args, player);
			} 
			else {
				event.execute(...args);
			}
		});
	}
}

// Set up music event listeners
const player = new Player(client);
player.extractors.register(SoundCloudExtractor);

player.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});

player.on("connectionError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.on("trackStart", (queue, track) => {
    queue.metadata.send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
});

player.on("trackAdd", (queue, track) => {
    queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
});

player.on("botDisconnect", (queue) => {
    queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
});

player.on("channelEmpty", (queue) => {
    queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
});

player.on("queueEnd", (queue) => {
    queue.metadata.send("✅ | Queue finished!");
});

// Login
client.login(TOKEN);