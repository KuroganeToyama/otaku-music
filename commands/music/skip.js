const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip to the next song in queue'),
    
    async execute(interaction, player) {
        await interaction.deferReply();

        const queue = player.nodes.get(interaction.guildId);
        if (!queue || !queue.isPlaying()) {
            await interaction.followUp({ content: "❌ | No music is being played!" });
            return;
        }

        const currentTrack = queue.currentTrack.title;
        const success = queue.node.skip();
        await interaction.followUp({
            content: success ? `✅ | Skipped **${currentTrack}**!` : "❌ | Something went wrong!"
        });
    },
};