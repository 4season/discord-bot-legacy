const Discord = require('discord.js');
const client = new Discord.Client();
const msgEmbed0 = new Discord.MessageEmbed();
const msgEmbed1 = new Discord.MessageEmbed()
    .setColor('9461ee')
    .setTitle('명령어 목록')
    .setDescription('사용 가능한 명령어 목록입니다. \n\u200B')
    .addFields({name: `'/명령어목록'`, value: '사용가능한 명령어 호출', inline: false},
        {name: `'/무한~'`, value: '테스트용으로 만든 명령어', inline: false},
        {name: `'/메이플공지'`, value: '메이플 공지사항의 첫페이지에 해당하는 정보를 가져옵니다.', inline: false},
        {name: `'/메이플이벤트'` , value: '메이플 이벤트의 첫페이지에 해당하는 정보를 가져옵니다.', inline: false});

const msgEmbed2 = new Discord.MessageEmbed();


const request = require('request'),
    cheerio = require('cheerio');
    //jschardet = require('jschardet'),
    //iconv = require('iconv-lite');


let count = 0;

let tagArr = [];
let noticeArr0 = [];
let noticeArr1 = [];
let switching = false;

let tagArr0 = [];
let eventArr0 = [];
let eventArr1 = [];


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
        let timeSet = new Date();
        let daySet = timeSet.getDay();
        let dateSet = timeSet.getDate();
        let monthSet = timeSet.getMonth();
        let hourSet_get = timeSet.getHours();
        let hourSet_kst = timeSet.setHours(`${hourSet_get+9}`);
        let hourSet = hourSet_kst.toString();
        let minuteSet = timeSet.getMinutes();
        let ctuSet = timeSet.getTimezoneOffset();
        let dayList = ["월", "화", "수", "목", "금", "토", "일"]; //1, 2, 3, 4, 5, 6, 0
        let dayMatch = `${daySet-1}`;
        let comText = dayList[dayMatch];

        if (hourSet === 23 && minuteSet === 50) {
            msg.channel.send('@everyone');
            msg.channel.send(`오늘은 ${comText}요일!! /n 내일이 되기 10분 전이에요~`);
            msg.channel.send("못하신 메할일이 있는지 확인하시고, 12시 이후 길보를 준비해주세요!");
            msg.channel.send("길보장소는 20세이상채널 루타비스 입니다.");
        }

        if (msg.content === '/명령어목록') {
            msg.channel.send(msgEmbed1);
        }

        if (msg.content === "/무한~") {
            //msg.channel.send('@everyone');
            msg.channel.send(`현제시각 ${monthSet+1}월 ${dateSet}일 ${comText}요일 ${hourSet}시 ${minuteSet}분 입니다.`);
            msg.channel.send(`${timeSet} 그리고 ${ctuSet}`);
            msg.reply("무~야호~!");
        }

        if (msg.content === '/메이플이벤트') {
            getEvent(msg);
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

const getEvent = (msg) => {
    try {
        request({
                url: "https://maplestory.nexon.com/News/Event",
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
                console.log(tagArr0.length);

                const $ = cheerio.load(body);
                const taglist = $("#container > div > div > div.event_board > ul > li > div > dl").toArray(); //.news_board
                taglist.forEach((dl) => {
                    const TagF = $(dl).find("a").first();
                    const path = TagF.attr("href");
                    const url = `https://maplestory.nexon.com${path}`;
                    const TagC = $(dl).find("dd > p > a");
                    const title = TagC.text().trim();
                    const TagL = $(dl).find("p").last();
                    let date = TagL.text().trim();

                    tagArr0.push({"url": url, "title": title, "date": date});
                    eventArr0.push({"url": url, "title": title, "date": date});
                    eventArr1.push({"date": date});
                    console.log(tagArr0.length);

                });
                emdFor0(msg);
            });
    } catch (err) {
        console.error(err);
    }
}

const emdFor0 = (msg) => {
    try {

        msgEmbed2.setColor('9461ee');
        msgEmbed2.setTitle('이벤트 결과');
        msgEmbed2.setDescription(`최근 이벤트 ${tagArr0.length}개 항목을 가져옵니다.\n\u200B`);

        //console.log(`${tagArr0[0].title}`);

        for (let i = 0; i < tagArr0.length+1; i++) {
            if(i < tagArr0.length) {
                count++;
                msgEmbed2.addFields({
                    name: `${count}. ${tagArr0[i].title} \n 이벤트기간: ${tagArr0[i].date}`, value: `${tagArr0[i].url}`, inline: false
                });
            } else if (i >= tagArr0.length) {
                msg.channel.send(msgEmbed2);
                count = 0;
                msgEmbed2.spliceFields(0, tagArr0.length);
                tagArr0.splice(0, tagArr0.length);
                console.log(tagArr0.length);
                break;
            }
        }} catch (err) {
        console.error(err);
    }
}


client.login(process.env.TOKEN);