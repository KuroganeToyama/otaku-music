const { SlashCommandBuilder, EmbedBuilder, userMention } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('View all songs currently in queue'),
    
    async execute(interaction, player) {
        await interaction.deferReply();
        const embed = new EmbedBuilder().setTitle('Music Queue Information');

        const queue = player.nodes.get(interaction.guildId);
        if (!queue || !queue.isPlaying()) {
            embed.setColor('Red')
                .setDescription('There are no songs in queue');
            await interaction.followUp({embeds: [embed]});
            return;
        }

        const curr = [`0. **[${queue.currentTrack.title}](${queue.currentTrack.url})** (requested by: ${queue.currentTrack.requestedBy.username})`];
        const inQueue = queue.tracks.map((track, i) => {
            return `${i + 1}. **[${track.title}](${track.url})** (requested by: ${track.requestedBy.username})`;
        });

        const tracks = curr.concat(inQueue);

        embed.setColor('Green')
            .setDescription(tracks.join('\n'))
            .setFooter({
                text: `Currently playing: ${queue.currentTrack.title}`,
            });

        await interaction.followUp({embeds: [embed]});
    },
};