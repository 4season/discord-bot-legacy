const Discord = require('discord.js');
const client = new Discord.Client();

const request = require('request'),
    cheerio = require('cheerio'),
    jschardet = require('jschardet'),
    iconv = require('iconv-lite');


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
                let tagArr = [];
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
            console.log("공지사항");
            for(let i = 0; i < tagArr.length; i++) {
                count++;
                msg.reply(`${count}. ${tagArr[i].title}\n   ${tagArr[i].url}\n   작성일: ${tagArr[i].date}`);
            }
    });
}


client.login(process.env.TOKEN);