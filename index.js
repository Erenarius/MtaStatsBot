const Discordarius = require('discord.js');
const ariusmta = require('gamedig');
const ariusconfig = require('./config.json');

// Erenarius 2023
const arius = new Discordarius.Client({ intents: [Discordarius.Intents.FLAGS.GUILDS] });
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { config } = require('process');

const commands = [
	new SlashCommandBuilder().setName('stat').setDescription('Sunucuya Ait İstatistikleri Görebilirsiniz.'),
    new SlashCommandBuilder().setName('ip').setDescription('Güncel IP Adresini alabilirsiniz'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(ariusconfig.token);

arius.once('ready', () => {
	console.log(`Girdi: ${arius.user.tag}`);
    setInterval(() => {
        ariusmta.query({
            type: 'mtasa',
            host: ariusconfig.server_ip,
            port: ariusconfig.server_port
        }).then((state) => {
            arius.user.setActivity(`Sunucuda ${state.raw.numplayers} Kişi`);
        }).catch(err => {
            console.log(err);
        });
    }, 5000);
    (async () => {
        try {
            await rest.put(
                Routes.applicationGuildCommands(arius.user.id, ariusconfig.guildId),
                { body: commands },
            );
    
            console.log('Komutlar Başarıyla Yüklendi.');
        } catch (error) {
            console.error(error);
        }
    })();
});
//ip command test
arius.on('interactionCreate', async ariusmsg => {
	if (!ariusmsg.isCommand()) return;

    const { commandName } = ariusmsg;

	if (commandName === 'ip') {
		ariusmta.query({
            type: 'mtasa',
            host: ariusconfig.server_ip,
            port: ariusconfig.server_port
        }).then(async (state) => {
            console.log(state)
            var ariusembed = new Discordarius.MessageEmbed()
            .setTitle('ARIUS ROLEPLAY V3')
            .addField(`Gecikme Süresi:`,` - ${state.ping}ms`,true)
            .addField(`\nIP/Adres:`,` - ${state.connect}`,true)
            .addField({'• Discord.JS sürüm', value: `14.2.0`, inline: true})
            .addField({'• Node.JS sürüm', value: `v16.14.2`, inline: true})
            .addField({'• Bot Kuruluş', value: `07.09.2021`, inline: true})
            .addField({'• Komut Sayısı', value: `Bilinmiyor`, inline: true})
            .setTimestamp()
            .setThumbnail("https://multitheftauto.com/mtasa_icon_hq.png")
            .setFooter(`Kullanan: ${ariusmsg.member.user.tag} * Developed By Erenarius` ,ariusmsg.member.user.avatarURL());

            await ariusmsg.reply({ embeds: [ariusembed] });
        }).catch(err => {
            console.log(err);
        });
	} 
});

// Erenarius 2023
arius.on('interactionCreate', async ariusmsg => {
	if (!ariusmsg.isCommand()) return;

    const { commandName } = ariusmsg;

	if (commandName === 'stat') {
		ariusmta.query({
            type: 'mtasa',
            host: ariusconfig.server_ip,
            port: ariusconfig.server_port
        }).then(async (state) => {
            console.log(state)
            var ariusembed = new Discordarius.MessageEmbed()
            .setTitle(state.name)
            .setColor(`RED`)
            .addField(`Harita :`,` - ${state.map}`,true)
            .addField(`Oyun Tipi :`,` - ${state.raw.gametype}`,true)
            .addField(`Geliştirici :`,` - Red Roleplay`,true)
            .addField(`Oyuncular :`,` - ${state.raw.numplayers}/${state.maxplayers}`,true)
            .addField(`Gecikme Süresi:`,` - ${state.ping}ms`,true)
            .addField(`IP/Adres:`,` - ${state.connect}`,true)
            .setTimestamp()
            .setThumbnail("https://multitheftauto.com/mtasa_icon_hq.png")
            .setFooter(`Kullanan: ${ariusmsg.member.user.tag} * Developed By Erenarius` ,ariusmsg.member.user.avatarURL());

            await ariusmsg.reply({ embeds: [ariusembed] });
        }).catch(err => {
            console.log(err);
        });
	} 
});
arius.login(ariusconfig.token);
// Erenarius 2023
