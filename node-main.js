const Discord = require('discord.js');
const client = new Discord.Client();

const request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs');
    //iconv = require('iconv-lite');


let count = 0;
let switching_time = [];



let tagArr = [];
let noticeArr0 = [];
let noticeArr1 = [];
//let switching = false;

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

        const msgTnt = msg.content;
        const msgStr = msgTnt.split(" ");

        const timezoneGet = new Date();
        const timezoneGet_time = timezoneGet.getTime();
        const timezoneSet = timezoneGet.setTime(timezoneGet_time+(9*60*60*1000));
        const timeFormat_KST = new Date(timezoneSet);
        const yearGet = timeFormat_KST.getFullYear();
        const monthGet = timeFormat_KST.getMonth();
        const dateGet = timeFormat_KST.getDate();
        const dayGet = timeFormat_KST.getDay();
        const hourGet = timeFormat_KST.getHours();
        const minuteGet = timeFormat_KST.getMinutes();
        const secondGet = timeFormat_KST.getSeconds();
        const millisecondGet = timeFormat_KST.getMilliseconds();

        const dayList = ["월", "화", "수", "목", "금", "토", "일"]; //1, 2, 3, 4, 5, 6, 0
        const day_toString = ( ) => {

            if (dayGet === 0) {
                const data_A = dayList[6];
                return data_A;
            }
            else {
                const dayMatch = dayGet - 1;
                const data_B = dayList[dayMatch];
                return data_B;
            }
        }

        if (msg.content === '/명령어목록') {
            const msgEmbed = new Discord.MessageEmbed();
            msgEmbed.setColor('eeac05');
            msgEmbed.setTitle('명령어 목록');
            msgEmbed.setDescription('사용 가능한 명령어 목록입니다. \n\u200B');
            msgEmbed.addFields(
                {name: `'/명령어목록'`, value: '사용가능한 명령어 호출', inline: false},
                {name: `'/무한~'`, value: '테스트용으로 만든 명령어', inline: false},
                {name: `'/메이플공지'`, value: '메이플 공지사항의 첫페이지에 해당하는 정보를 가져옵니다.', inline: false},
                {name: `'/메이플이벤트'` , value: '메이플 이벤트의 첫페이지에 해당하는 정보를 가져옵니다.', inline: false},
                {name: `'/시간알림 ON/OFF'`, value: '매일 오후 12시에 년, 월, 일, 요일 등을 알리는 알림을 설정합니다.', inline: false});
            msg.channel.send(msgEmbed);
        }

        if (msg.content === "/무한~") {
            //msg.channel.send('@everyone');
            msg.channel.send(`현재시각 ${yearGet}년 ${monthGet+1}월 ${dateGet}일 ${day_toString()}요일 ${hourGet}시 ${minuteGet}분 ${secondGet}초 입니다.`);
            msg.channel.send(typeof day_toString);
            //msg.channel.send(`${timeSet} 그리고 ${ctuSet}`);
            msg.reply("무~야호~!");
        }

        fs.readFile('/Data/switchTime.js', 'utf-8', function(err, data) {
            if (switching_time === " ") {
                switching_time.push(data);
            }
        });

        if (msg.content === "/시간알림") {
            msg.reply("ON / OFF 로 설정을 변경하실수 있습니다.");
            msg.reply(`현제상태 '${switching_time[0].switch}'`);
        } else if (msgStr[0] === "/시간알림" && msgStr[1] === 'ON') {
            if (switching_time[0].switch === true) {
                msg.reply("시간 알림기능이 이미 설정된 상태 입니다.");
            } else {
                switching_time[0].switch = true;
                fs.writeFileSync('/Data/switchTime.js','{ "switch": true }');
                msg.reply("시간 알림기능이 설정되었습니다.");
            }
        } else if (msgStr[0] === "/시간알림" && msgStr[1] === 'OFF') {
            if (switching_time[0].switch === false) {
                msg.reply("시간 알림기능이 이미 해제된 상태 입니다.");
            } else {
                switching_time[0].switch = false;
                fs.writeFileSync('/Data/switchTime.js','{ "switch": false }');
                msg.reply("시간 알림기능이 해제되었습니다.");
            }
        }

        if (switching_time[0].switch === true) {
            if (hourGet === 12 && minuteGet === 0 && secondGet === 0 && millisecondGet === 0) {
                msg.channel.send('@everyone');
                msg.channel.send(`오늘은 ${yearGet}년 ${monthGet+1}월 ${dateGet}일 ${day_toString()}요일 입니다.`);
            }
        }

        if (msg.content === '/메이플이벤트') {
            getEvent(msg);
        }

        if (msg.content === '/메이플공지') {
            getNotice(msg);
        }

        if (msg.content === '/캐릭터정보') {
            msg.channel.send("캐릭터 닉네임을 정확하게 입력해 주세요.");
        }
        else if (msgStr[0] === '/캐릭터정보') {
            const msgData = msgStr[1];
            getRanking(msg, msgData);
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
                emdFor_Notice(msg);
            });
    } catch (err) {
        console.error(err);
    }
}

const emdFor_Notice = (msg) => {
    try {
        const msgEmbed = new Discord.MessageEmbed();
        msgEmbed.setColor('eeac05');
        msgEmbed.setTitle('공지사항 결과');
        msgEmbed.setDescription(`최근 공지사항 ${tagArr.length}개 항목을 가져옵니다.\n\u200B`);

        for (let i = 0; i < tagArr.length+1; i++) {
            if(i < tagArr.length) {
                count++;
                msgEmbed.addFields({
                    name: `${count}. ${tagArr[i].title} \n 작성일: ${tagArr[i].date}`, value: `${tagArr[i].url}`, inline: false
                });
            } else if (i >= tagArr.length) {
                msg.channel.send(msgEmbed);
                count = 0;
                msgEmbed.spliceFields(0, tagArr.length);
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
                emdFor_Event(msg);
            });
    } catch (err) {
        console.error(err);
    }
}

const emdFor_Event = (msg) => {
    try {
        const msgEmbed = new Discord.MessageEmbed();
        msgEmbed.setColor('eeac05');
        msgEmbed.setTitle('이벤트 결과');
        msgEmbed.setDescription(`최근 이벤트 ${tagArr0.length}개 항목을 가져옵니다.\n\u200B`);

        //console.log(`${tagArr0[0].title}`);

        for (let i = 0; i < tagArr0.length+1; i++) {
            if(i < tagArr0.length) {
                count++;
                msgEmbed.addFields({
                    name: `${count}. ${tagArr0[i].title} \n 이벤트기간: ${tagArr0[i].date}`, value: `${tagArr0[i].url}`, inline: false
                });
            } else if (i >= tagArr0.length) {
                msg.channel.send(msgEmbed);
                count = 0;
                msgEmbed.spliceFields(0, tagArr0.length);
                tagArr0.splice(0, tagArr0.length);
                console.log(tagArr0.length);
                break;
            }
        }} catch (err) {
        console.error(err);
    }
}

const getRanking = (msg, msgData) => {
    try {
        request({
                url: `https://maplestory.nexon.com/Ranking/World/Total?c=${msgData}`,
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
                const taglist = $("#container > div > div > div > div.rank_table_wrap > table > tbody > tr.search_com_chk").toArray(); //.news_board
                taglist.forEach((tr) => {
                    const TagF = $(tr).find("td.lest > span.char_img > img").first();
                    const imgUrl = TagF.attr("class src");
                    const TagN = $(tr).find("td.left > dl > dt > a").last();
                    const Name = TagN.text().trim();
                    const TagW = $(tr).find("td.left > dl > dd")
                    const Work = TagW.text().trim();

                    tagArr.push({"url": url, "title": title, "date": date});
                    noticeArr0.push({"url": url, "title": title, "date": date});
                    noticeArr1.push({"date": date});
                    console.log(tagArr.length);

                });
                emdFor_Notice(msg);
            });
    } catch (err) {
        console.error(err);
    }
}


client.login(process.env.TOKEN);