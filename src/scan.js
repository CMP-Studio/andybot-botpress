const andybot = require('./andybot');
const activities = require('./activities.json');
const utils = require('./utils');
const _ = require('lodash');

// Scan handler

module.exports = async function handleScan(referral, event) {

    const scanResponse = await andybot.scan.scanCode(event.user.id, referral);
    const avaliableActivities = await andybot.avaliableActivities(event.user.id);

    // 1. Handle stamp unlock
    if (utils.isNonNull(scanResponse) && scanResponse.type === 'stamp'){
        if (scanResponse.stamp.error && scanResponse.stamp.error === "DailyLimitReached") {
            event.reply("#stamp-limit-reached");
            event.reply("#more-activities", { activities: _.shuffle(avaliableActivities).slice(0, 9) });
            return;
        } else {
            const stampObj = _.find(activities.stamps, (s) => s.stamp_id === scanResponse.code)
            const image = "andy-" + stampObj.stamp_id + ".png";
            event.reply("#stamp_unlock", { image, title: "You unlocked the " + stampObj.name + " stamp!" });
            event.reply("#more-activities", { activities: _.shuffle(avaliableActivities).slice(0, 9) });
        }
    }

    console.log(scanResponse);
    // 2. Handle scavenger hunt scan
    if (utils.isNonNull(scanResponse) && scanResponse.type === 'scavengerhunt') {
        if (utils.isNonNull(scanResponse.scavengerhunt)){
            let res = scanResponse.scavengerhunt;
            const avaliableActivities = await andybot.avaliableActivities(event.user.id);
            
            if (res.completed) {
                event.reply("scavengerhunt-complete");
                event.reply("#more-activities", { activities: _.shuffle(avaliableActivities).slice(0, 9) });
            } else if (res.lastScan && utils.isNonNull(res.foundIt)) {
                event.reply("scavengerhunt-last-scan", { foundIt: res.foundIt });
                event.reply("#more-activities", { activities: _.shuffle(avaliableActivities).slice(0, 9) });
            } else if (res.firstScan && utils.isNonNull(res.nextClue) && utils.isNonNull(res.foundIt)) {
                event.reply("scavengerhunt-first-scan", { foundIt: res.foundIt, nextClue: res.nextClue, nextClueNumber: res.nextClueNumber });
            } else if (res.alreadyFound && utils.isNonNull(res.nextClue)) {
                event.reply("scavengerhunt-repeat-scan", { nextClue: res.nextClue, nextClueNumber: res.nextClueNumber });
            } else if (!res.lastScan && utils.isNonNull(res.nextClue) && utils.isNonNull(res.foundIt)) {
                event.reply("scavengerhunt-scan", { foundIt: res.foundIt, nextClue: res.nextClue, nextClueNumber: res.nextClueNumber });
            }  
        }
    }

    // 3. Handle paper map
    if (utils.isNonNull(scanResponse) && scanResponse.type === 'map') {
        event.reply("map");
    }

    // 4. Handle generic
    if (utils.isNonNull(scanResponse) && scanResponse.type === 'generic') {
        event.reply("generic");
        event.reply("#activities", { activities: _.shuffle(avaliableActivities).slice(0, 9) });
    }
    
    return;
}