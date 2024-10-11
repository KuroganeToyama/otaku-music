const { SlashCommandBuilder } = require('discord.js');
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song of your choice!')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The title of the song you want to play')
                .setRequired(true)
        ),
    
    async execute(interaction, player) {
        await interaction.deferReply();

        // Search for song from Soundcloud
        const song = interaction.options.getString('song');
        const searchResult = await player
            .search(song, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            .catch(() => {});

        // If search turns up nothing
        if (!searchResult || !searchResult.tracks.length) {
            await interaction.followUp({ content: "No results were found!" });
            return;
        }

        const queue = player.nodes.create(interaction.guild, {
            metadata: interaction.channel
        });

        try {
            if (!queue.connection) {
                await queue.connect(interaction.member.voice.channel);
            }
        } 
        catch {
            player.nodes.delete(interaction.guildId);
            await interaction.followUp({ content: "Could not join your voice channel!" });
            return;
        }

        const track = searchResult.tracks[0];
        await interaction.followUp({ content: `⏱ | Loaded **${track.title}**` });
        queue.addTrack(track);
        if (!queue.isPlaying()) {
            await queue.node.play();
        }
    },
};