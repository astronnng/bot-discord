const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Para a música e limpa a fila'),
    async execute(interaction) {
        const player = interaction.client.lavalink.getPlayer(interaction.guild.id);

        if (!player) {
            return interaction.reply({ content: 'Não há música tocando neste servidor.', ephemeral: true });
        }

        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel || voiceChannel.id !== player.voiceChannelId) {
            return interaction.reply({ content: 'Você precisa estar no mesmo canal de voz que o bot para parar a música!', ephemeral: true });
        }

        player.destroy();
        return interaction.reply({ content: 'Parei a música e limpei a fila.' });
    },
};