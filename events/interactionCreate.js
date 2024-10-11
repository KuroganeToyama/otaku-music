const { Events, GuildMember } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, player) {
		if (!interaction.isChatInputCommand()) {
			return;
		}

		if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
			await interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
			return;
		}

		// if (interaction.member.voice.channelId !== VOICE_CHANNEL_ID) {
		// 	await interaction.reply({ content: `You are not in ${channelMention(VOICE_CHANNEL_ID)}!`, ephemeral: true });
		// 	return;
		// }

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction, player);
		} 
        catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'Error executing this command', ephemeral: true });
			} 
            else {
				await interaction.reply({ content: 'Error executing this command', ephemeral: true });
			}
		}
	},
};