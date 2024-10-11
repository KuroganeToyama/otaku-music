const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { pagination, ButtonTypes, ButtonStyles } = require('@devraelfreeze/discordjs-pagination');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('View all songs currently in queue'),
    
    async execute(interaction, player) {
        await interaction.deferReply();

        const queue = player.nodes.get(interaction.guildId);
        if (!queue || !queue.isPlaying()) {
            const embed = new EmbedBuilder()
                            .setTitle('Music Queue Information')
                            .setColor('Red')
                            .setDescription('There are no songs in queue!');
            await interaction.followUp({embeds: [embed]});
            return;
        }

        // Counter for numbering
        let counter = 1;

        // List of tracks to be displayed
        const curr = [`1) **[${queue.currentTrack.title}](${queue.currentTrack.url})** (requested by: ${queue.currentTrack.requestedBy.username})`];
        const inQueue = queue.tracks.map((track) => {
            ++counter;
            return `${counter}) **[${track.title}](${track.url})** (requested by: ${track.requestedBy.username})`;
        });
        const tracks = curr.concat(inQueue);

        // List of embeds for pagination
        let embedList = [];
        const numOfTracks = tracks.length;
        for (let i = 0; i < numOfTracks; i += 8) {
            const startIdx = i;
            const endIdx = (i + 8 <= numOfTracks - 1) ? (i + 8) : numOfTracks;
            const section = tracks.slice(startIdx, endIdx);
                
            const embed = new EmbedBuilder()
                            .setTitle('Music Queue Information')
                            .setColor('Green')
                            .setDescription(section.join('\n'))
                            .setFooter({
                                text: `Currently playing: ${queue.currentTrack.title}`,
                            });
            
            embedList.push(embed);
        }

        // Pagination
        await pagination({
            embeds: embedList,
            author: interaction.member.user,
            interaction: interaction,
            ephemeral: true,
            time: 60000,
            disableButtons: false,
            fastSkip: false,
            pageTravel: false,
            buttons: [
                {
                    type: ButtonTypes.previous,
                    label: 'Prev',
                    style: ButtonStyles.Primary
                },
                {
                    type: ButtonTypes.next,
                    label: 'Next',
                    style: ButtonStyles.Success
                }
            ]
        });
    },
};