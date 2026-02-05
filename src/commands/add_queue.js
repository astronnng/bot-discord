const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_queue')
        .setDescription('Adiciona várias músicas à fila separadas por ponto e vírgula (;)')
        .addStringOption(option =>
            option.setName('lista')
                .setDescription('Músicas/Links separados por ; (Ex: Link1; Rock; Link2)')
                .setRequired(true)),
    async execute(interaction) {
        const lista = interaction.options.getString('lista');
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: 'Você precisa estar em um canal de voz para adicionar músicas!', ephemeral: true });
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

            player.connect();

            const queries = lista.split(';').map(q => q.trim()).filter(q => q.length > 0);
            let addedCount = 0;
            let failedCount = 0;

            for (const query of queries) {
                try {
                    const res = await player.search(query, interaction.user);

                    if (!res || !res.tracks || res.tracks.length === 0 || res.loadType === 'empty' || res.loadType === 'error') {
                        failedCount++;
                        continue;
                    }

                    if (res.loadType === 'playlist') {
                        player.queue.add(res.tracks);
                        addedCount += res.tracks.length;
                    } else {
                        // Se for busca, pega apenas o primeiro resultado
                        player.queue.add(res.tracks[0]);
                        addedCount++;
                    }
                } catch (e) {
                    console.error(`Erro ao buscar "${query}":`, e);
                    failedCount++;
                }
            }

            if (!player.playing && player.queue.size > 0) {
                await player.play();
            }

            let msg = `✅ Processo concluído! **${addedCount}** faixas foram adicionadas à fila.`;
            if (failedCount > 0) {
                msg += `\n⚠️ Não foi possível encontrar **${failedCount}** itens da lista.`;
            }

            return interaction.editReply({ content: msg });

        } catch (error) {
            console.error(error);
            return interaction.editReply({ content: 'Ocorreu um erro crítico ao tentar processar a lista.' });
        }
    },
};
