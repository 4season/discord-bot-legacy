const Discord = require('discord.js');
const client = new Discord.Client();
const msgEmbed0 = new Discord.MessageEmbed();
const msgEmbed1 = new Discord.MessageEmbed()
    .setColor('9461ee')
    .setTitle('명령어 목록')
    .setDescription('사용 가능한 명령어 목록입니다. \n\u200B')
    .addFields({name: `'/명령어목록'`, value: '사용가능한 명령어 호출', inline: false},
        {name: `'/무한~'`, value: '테스트용으로 만든 명령어', inline: false},
        {name: `'/메이플공지'`, value: '메이플 공지사항 10개를 가져옵니다.', inline: false});


const request = require('request'),
    cheerio = require('cheerio');
    //jschardet = require('jschardet'),
    //iconv = require('iconv-lite');


let tagArr = [];
let noticeArr0 = [];
let noticeArr1 = [];
let count = 0;
let switching = false;


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

        if (msg.content === '/명령어목록') {
            msg.channel.send(msgEmbed1);
        }

        if (msg.content === "/무한~") {
            msg.reply("무~야호~!");
        }

        const msgTnt = msg.content;
        const msgStr = msgTnt.split(" ");
        if (msg.content === "/메이플공지") {
            getNotice(msg);
        } else if (msgStr[0] === "/메이플공지" && msgStr[1] === 'ON') {
            if (switching === true) {
                msg.reply("공지사항 알림기능이 이미 설정된 상태 입니다.");
            } else {
                switching = true;
                msg.reply("공지사항 알림기능이 설정되었습니다.");
            }
        } else if (msgStr[0] === "/메이플공지" && msgStr[1] === 'OFF') {
            if (switching === false) {
                msg.reply("공지사항 알림기능이 이미 해제된 상태 입니다.");
            } else {
                switching = false;
                msg.reply("공지사항 알림기능이 해제되었습니다.");
            }
        }

    } catch (err) {
        console.error(err);
    }
});

const getNotice = (msg) => {
    try {
        request({
                url: "https://maplestory.nexon.com/News/Notice",
                method: "GET"
            },
            (err, response, body) => {
                if (err) {
                    console.error(err);
                    return;
                } else {
                    (response.statusCode === 200)
                }
                console.log("Ready");
                console.log(tagArr.length);

                const $ = cheerio.load(body);
                const taglist = $("#container > div > div > div.news_board > ul > li").toArray(); //.news_board
                taglist.forEach((li) => {
                    const TagF = $(li).find("a").first();
                    const path = TagF.attr("href");
                    const url = `https://maplestory.nexon.com${path}`;
                    const title = TagF.text().trim();
                    const TagL = $(li).find("dd").last();
                    let date = TagL.text().trim();

                    /*
                    if (date === '') {
                        date = "Null";
                    }
                    */

                    tagArr.push({"url": url, "title": title, "date": date});
                    noticeArr0.push({"url": url, "title": title, "date": date});
                    noticeArr1.push({"date": date});
                    console.log(tagArr.length);

                });
                emdFor(msg);
            });
    } catch (err) {
        console.error(err);
    }
}

const emdFor = (msg) => {
    try {

    msgEmbed0.setColor('9461ee');
    msgEmbed0.setTitle('공지사항 결과');
    msgEmbed0.setDescription(`최근 공지사항 ${tagArr.length}개 항목을 가져옵니다.\n\u200B`);

    for (let i = 0; i < tagArr.length+1; i++) {
        if(i < tagArr.length) {
            count++;
            msgEmbed0.addFields({
                name: `${count}. ${tagArr[i].title} \n 작성일: ${tagArr[i].date}`, value: `${tagArr[i].url}`, inline: false
            });
        } else if (i >= tagArr.length) {
            msg.channel.send(msgEmbed0);
            count = 0;
            msgEmbed0.spliceFields(0, tagArr.length);
            tagArr.splice(0, tagArr.length);
            console.log(tagArr.length);
            break;
        }
    }} catch (err) {
        console.error(err);
    }
}


client.login(process.env.TOKEN);