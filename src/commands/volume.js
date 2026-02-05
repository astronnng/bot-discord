const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Define o volume (0-100)')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Nível do volume')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(100)),
    async execute(interaction) {
        const level = interaction.options.getInteger('level');
        const player = interaction.client.lavalink.getPlayer(interaction.guild.id);

        if (!player) {
            return interaction.reply({ content: 'Não há música tocando neste servidor.', ephemeral: true });
        }

        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel || voiceChannel.id !== player.voiceChannelId) {
            return interaction.reply({ content: 'Você precisa estar no mesmo canal de voz que o bot para alterar o volume!', ephemeral: true });
        }

        player.setVolume(level);
        return interaction.reply({ content: `Volume definido para ${level}%.` });
    },
};