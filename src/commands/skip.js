const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Pula a música atual'),
    async execute(interaction) {
        const player = interaction.client.lavalink.getPlayer(interaction.guild.id);

        if (!player) {
            return interaction.reply({ content: 'Não há música tocando neste servidor.', ephemeral: true });
        }

        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel || voiceChannel.id !== player.voiceChannelId) {
            return interaction.reply({ content: 'Você precisa estar no mesmo canal de voz que o bot para pular músicas!', ephemeral: true });
        }

        if (player.queue.size === 0) {
            player.destroy();
            return interaction.reply({ content: 'Pulei a última música. Saindo do canal de voz.' });
        }

        player.skip();
        return interaction.reply({ content: 'Pulei a música atual.' });
    },
};