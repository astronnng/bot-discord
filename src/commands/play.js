const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Toca uma música do YouTube, Spotify ou outras fontes')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('A música para tocar')
                .setRequired(true)),
    async execute(interaction) {
        let query = interaction.options.getString('query');
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: 'Você precisa estar em um canal de voz para tocar música!', ephemeral: true });
        }

        const permissions = voiceChannel.permissionsFor(interaction.guild.members.me);
        if (!permissions.has('Connect') || !permissions.has('Speak')) {
            return interaction.reply({ content: 'Preciso de permissões para conectar e falar no seu canal de voz!', ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const player = interaction.client.lavalink.createPlayer({
                guildId: interaction.guild.id,
                voiceChannelId: voiceChannel.id,
                textChannelId: interaction.channel.id,
                selfDeaf: true,
                selfMute: false,
                volume: 80,
            });

            // Conectar ao canal de voz
            player.connect(); 

            if (query.startsWith('query:')) {
                query = query.slice('query:'.length).trim();
            }

            const res = await player.search(query, interaction.user);

            if (!res || !res.tracks || res.tracks.length === 0 || res.loadType === 'empty') {
                return interaction.editReply({ content: 'Nenhum resultado encontrado para essa busca.' });
            }

            if (res.loadType === 'playlist') {
                player.queue.add(res.tracks);
                if (!player.playing) {
                    await player.play(res.tracks[0].track);
                }
                return interaction.editReply({ content: `Adicionei a playlist **${res.playlist?.title || 'Desconhecido'}** com ${res.tracks.length} faixas à fila.` });
            } else {
                const track = res.tracks[0];
                player.queue.add(track);
                if (!player.playing) {
                    await player.play(track.track);
                }
                return interaction.editReply({ content: `Adicionei **${track.info?.title || 'Desconhecido'}** de **${track.info?.author || 'Desconhecido'}** à fila.` });
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply({ content: 'Ocorreu um erro ao tentar tocar a música.' });
        }
    },
};