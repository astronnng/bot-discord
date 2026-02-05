const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Retoma a música pausada'),
    async execute(interaction) {
        const player = interaction.client.lavalink.getPlayer(interaction.guild.id);

        if (!player) {
            return interaction.reply({ content: 'Não há música tocando neste servidor.', ephemeral: true });
        }

        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel || voiceChannel.id !== player.voiceChannelId) {
            return interaction.reply({ content: 'Você precisa estar no mesmo canal de voz que o bot para retomar a música!', ephemeral: true });
        }

        if (!player.paused) {
            return interaction.reply({ content: 'A música não está pausada.', ephemeral: true });
        }

        player.pause(false);
        return interaction.reply({ content: 'Música retomada.' });
    },
};