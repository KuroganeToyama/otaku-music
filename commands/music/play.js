const { SlashCommandBuilder } = require('discord.js');
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music of your choice!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('track')
                .setDescription('Add a single track to the queue')
                .addStringOption(option =>
                    option
                        .setName('query')
                        .setDescription('Query to search for track')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Add a playlist to the queue')
                .addStringOption(option =>
                    option
                        .setName('query')
                        .setDescription('Query to search for playlist')
                        .setRequired(true))
        ),
    
    async execute(interaction, player) {
        await interaction.deferReply();

        if (interaction.options.getSubcommand() === 'track') {
            // Search for track from SoundCloud
            const query = interaction.options.getString('query');
            const searchResult = await player
                .search(query, {
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
            await interaction.followUp({ content: `⏱ | Loaded track **${track.title}** for query **${query}**` });
            queue.addTrack(track);
            if (!queue.isPlaying()) {
                await queue.node.play();
            }
            return;
        }

        if (interaction.options.getSubcommand() === 'list') {
            // Search for playlist from SoundCloud
            const query = interaction.options.getString('query');
            const searchResult = await player
                .search(query, {
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

            const playlist = searchResult.tracks;
            const playlistLength = playlist.length;
            await interaction.followUp({ content: `⏱ | Loaded **${playlistLength} track(s)** for query **${query}**` });
            queue.addTrack(playlist);
            if (!queue.isPlaying()) {
                await queue.node.play();
            }
            return;
        }
    },
};