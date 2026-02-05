require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { LavalinkManager } = require('lavalink-client');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Gerenciador Lavalink
client.lavalink = new LavalinkManager({
    nodes: [
        {
            authorization: process.env.LAVALINK_PASSWORD,
            host: process.env.LAVALINK_HOST,
            port: parseInt(process.env.LAVALINK_PORT),
            id: 'main',
            secure: process.env.LAVALINK_SECURE === 'true',
        },
    ],
    sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
    autoSkip: true,
    client: {
        id: process.env.BOT_ID,
        username: 'MusicBot',
    },
});

// Coleção de Comandos
client.commands = new Collection();

// Carregar Comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] O comando em ${filePath} está faltando a propriedade "data" ou "execute".`);
    }
}

// Carregar Eventos
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Eventos do Lavalink
client.on('raw', (d) => client.lavalink.sendRawData(d));

client.lavalink.on('nodeConnect', (node) => {
    console.log(`Node ${node.id} conectado`);
});

client.lavalink.on('nodeError', (node, error) => {
    console.error(`Node ${node.id} teve um erro: ${error}`);
});

client.lavalink.on('trackStart', (player, track) => {
    const channel = client.channels.cache.get(player.textChannelId);
    if (channel) {
        channel.send(`Tocando agora: **${track.info?.title || 'Desconhecido'}** de **${track.info?.author || 'Desconhecido'}**`);
    }
});

client.lavalink.on('queueEnd', (player) => {
    const channel = client.channels.cache.get(player.textChannelId);
    if (channel) {
        channel.send('A fila acabou. Saindo do canal de voz.');
        player.destroy();
    }
});

// Tratamento de erros globais para evitar crash
process.on('unhandledRejection', (reason, p) => {
    console.error('[Anti-Crash] Unhandled Rejection/Catch');
    console.error(reason, p);
});

process.on('uncaughtException', (err, origin) => {
    console.error('[Anti-Crash] Uncaught Exception/Catch');
    console.error(err, origin);
});

client.login(process.env.DISCORD_TOKEN);