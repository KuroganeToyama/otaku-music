const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop and exit music player'),
    
    async execute(interaction, player) {
        await interaction.deferReply();

        const queue = player.nodes.get(interaction.guildId);
        if (!queue || !queue.isPlaying()) {
            await interaction.followUp({ content: "❌ | No music is being played!" });
            return;
        }

        queue.delete();
        await interaction.followUp({ content: "🛑 | Stopped the player!" });
    },
};