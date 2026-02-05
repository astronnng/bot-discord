const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pausa a música atual'),
    async execute(interaction) {
        const player = interaction.client.lavalink.getPlayer(interaction.guild.id);

        if (!player) {
            return interaction.reply({ content: 'Não há música tocando neste servidor.', ephemeral: true });
        }

        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel || voiceChannel.id !== player.voiceChannelId) {
            return interaction.reply({ content: 'Você precisa estar no mesmo canal de voz que o bot para pausar a música!', ephemeral: true });
        }

        if (player.paused) {
            return interaction.reply({ content: 'A música já está pausada.', ephemeral: true });
        }

        player.pause(true);
        return interaction.reply({ content: 'Música pausada.' });
    },
};