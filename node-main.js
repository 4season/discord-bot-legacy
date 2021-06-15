const Discord = require('discord.js');
const client = new Discord.Client();
const msgEmbed0 = new Discord.MessageEmbed();

const msgEmbed1 = new Discord.MessageEmbed()
    .setColor('9461ee')
    .setTitle('명령어 목록').setColor('9461ee')
    .setDescription('사용 가능한 명령어 목록입니다. \n\u200B')
    .addFields({name: `'/명령어목록'`, value: '사용가능한 명령어 호출', inline: true},
        {name: `'/무한~'`, value: '테스트용으로 만든 명령어', inline:true},
        {name: `'/메이플공지'`, value: '메이플 공지사항 10개를 가져옵니다.', inline: true});

const request = require('request'),
    cheerio = require('cheerio'),
    jschardet = require('jschardet'),
    iconv = require('iconv-lite');

let tagArr = [];

client.on('ready', () => {
    try {
        console.log(`Logged in as ${client.user.tag}!`);
    }
    catch (err) {
        console.error(err);
    }
});

client.on('message', (msg) => {
    try {
        if(msg.content === '/명령어목록') {

            msg.channel.send(msgEmbed1);
        }
        if(msg.content === "/무한~") {
            msg.reply("무~야호~!");
        }
        const msgTnt = msg.content;
        const msgStr = msgTnt.split(" ");
        if(msgStr[0] === "/메이플공지") {
            getNotice(msg);
        }
    } catch (err) {
        msg.reply(err);
        console.error(err);
    }
});

const getNotice = (msg) => {
    request( {
            url: "https://maplestory.nexon.com/News/Notice",
            method: "GET"
        },
        (error, response, body) => {
            if(error) {
                console.error(error);
                return;
            }
            else {
                (response.statusCode === 200)
            }
            console.log("Ready");

            //console.log(body);
            const $ = cheerio.load(body);
            const taglist = $("#container > div > div > div.news_board > ul > li").toArray(); //.news_board
            taglist.forEach((li) => {
                const TagF = $(li).find("a").first();
                const path = TagF.attr("href");
                const url = `https://maplestory.nexon.com${path}`;
                const title = TagF.text().trim();

                //console.log(url, title);

                const TagL = $(li).find("dd").last();
                let date = TagL.text().trim();

                if(date === '') {
                    date = "Null";
                }
                //console.log(date);
                tagArr.push({"url" : url, "title" : title, "date" : date});
            });
                let count = 0;
                for (let i = 0; i < tagArr.length; i++) {
                    count++;
                    msgEmbed0.addFields({
                        name: `${count}. ${tagArr[i].title} \n 작성일: ${tagArr[i].date}`, value: `${tagArr[i].url}`
                    });
                }
                msgEmbed0.setColor('9461ee');
                msgEmbed0.setTitle('공지사항 결과').setColor('9461ee');
                msgEmbed0.setDescription(`최근 공지사항 ${tagArr.length}개 항목을 가져옵니다.\n\u200B`);
                msg.channel.send(msgEmbed0);
                count = 0;
                tagArr.splice(0, `${tagArr.length}`);
    });
}


client.login(process.env.TOKEN);