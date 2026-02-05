const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Mostra a fila de músicas atual'),
    async execute(interaction) {
        const player = interaction.client.lavalink.getPlayer(interaction.guild.id);

        if (!player || !player.queue || !player.queue.tracks || player.queue.tracks.length === 0) {
            return interaction.reply({ content: 'A fila está vazia.', ephemeral: true });
        }

        const tracks = player.queue.tracks.slice(0, 10);
        const embed = new EmbedBuilder()
            .setTitle('Fila de Música')
            .setColor('#0099ff')
            .setDescription(
                tracks.map((track, index) => `${index + 1}. **${track.info?.title || 'Desconhecido'}** de **${track.info?.author || 'Desconhecido'}**`).join('\n')
            )
            .setFooter({ text: `Total de faixas: ${player.queue.tracks.length}` });

        return interaction.reply({ embeds: [embed] });
    },
};