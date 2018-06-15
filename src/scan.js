const andybot = require('./andybot');
const activities = require('./activities.json');
const utils = require('./utils');
const _ = require('lodash');

// Scan handler

module.exports = async function handleScan(referral, event) {
    if (utils.isNonNull(referral)) {
        const scanResponse = await andybot.scan.scanCode(event.user.id, referral.ref);

        // 1. Handle stamp unlock
        if (utils.isNonNull(scanResponse) && utils.isNonNull(scanResponse.stamp)){
            if (scanResponse.stamp.error && scanResponse.stamp.error === "DailyLimitReached") {
                event.reply("#daily_scan_limit_reached");
                return;
            } else {
                const stampObj = _.find(activities.stamps, (s) => s.stamp_id === scanResponse.code.ref)
                const image = stampObj.splash_image;
                event.reply("#stamp_unlock", { image, text: "You unlocked the " + stampObj.name + " stamp!"});
            }
        }

        console.log(scanResponse.scan.type);
        // 2. Handle Possible check in to a museum
        if (scanResponse.scan.type === 'checkin') {
            const avaliableActivities = await andybot.avaliableActivities(event.user.id);
            setTimeout(() => {
                event.reply('#activities', { activities: _.shuffle(avaliableActivities).slice(0, 9) });
            }, 2000);

            if (utils.isNonNull(scanResponse.scan.trigger) && typeof scanResponse.scan.trigger === 'object') {
                const avaliableActivities = _.map(triggeredActivities, (activity_id) => _.find(activities.manifest, (o) => o.activity === activity_id));
                if (utils.isNonNull(scanResponse.scan.followup)){
                    setTimeout(() => {
                        event.reply("#text",  { text: scanResponse.scan.followup });
                    }, 500);
                }

                setTimeout(() => {
                    event.reply("#activities",  { activities: _.shuffle(avaliableActivities).slice(0, 9) });
                }, 2000);
            }
        } else if (scanResponse.scan.type === 'activity' || scanResponse.scan.type === 'event') {
            const triggeredActivities = scanResponse.scan.trigger;
            console.log(triggeredActivities);
            const avaliableActivities = _.map(triggeredActivities, (activity_id) => _.find(activities.manifest, (o) => o.activity === activity_id));
            console.log(avaliableActivities);

            if (utils.isNonNull(scanResponse.scan.followup) && avaliableActivities.length === 0){
                setTimeout(() => {
                    event.reply("#text",  { text: scanResponse.scan.followup });
                }, 500);
            }

            if (avaliableActivities.length > 0){
                setTimeout(() => {
                    event.reply("#followupactivities",  { activities: _.shuffle(avaliableActivities).slice(0, 9), text: scanResponse.scan.followup || "Try these activities"  });
                }, 2000);
            }
        } else if (scanResponse.scan.type === 'scavengerhunt') {
            if (utils.isNonNull(scanResponse.scavengerhunt)){
                let res = scanResponse.scavengerhunt;
                const avaliableActivities = await andybot.avaliableActivities(event.user.id);
                console.log(scanResponse.scavengerhunt)
                // First get a frame out of the way --> special case
                if (scanResponse.scan.trigger === 0) {
                    if (res.firstScan && utils.isNonNull(res.nextClue)) {
                        event.reply("scavengerhunt-first-scan-sign", { nextClue: res.nextClue, nextClueNumber: res.nextClueNumber });
                    } else if (!res.huntComplete && utils.isNonNull(res.nextClue)) {
                        event.reply("scavengerhunt-scan-sign", { nextClue: res.nextClue, nextClueNumber: res.nextClueNumber });
                    } else if (res.huntComplete) {
                        event.reply("scavengerhunt-complete", { activities: _.shuffle(avaliableActivities).slice(0, 9) });
                    }
                } else {
                    if (res.firstScan && utils.isNonNull(res.nextClue) && utils.isNonNull(res.foundIt)) {
                        event.reply("scavengerhunt-first-scan", { foundIt: res.foundIt, nextClue: res.nextClue, nextClueNumber: res.nextClueNumber });
                    } else if (res.alreadyFound && utils.isNonNull(res.nextClue)) {
                        event.reply("scavengerhunt-repeat-scan", { nextClue: res.nextClue, nextClueNumber: res.nextClueNumber });
                    } else if (!res.lastScan && utils.isNonNull(res.nextClue) && utils.isNonNull(res.foundIt)) {
                        event.reply("scavengerhunt-scan", { foundIt: res.foundIt, nextClue: res.nextClue, nextClueNumber: res.nextClueNumber });
                    } else if (res.lastScan && utils.isNonNull(res.foundIt)) {
                        event.reply("scavengerhunt-last-scan", { foundIt: res.foundIt, activities: _.shuffle(avaliableActivities).slice(0, 9) });
                    } else if (res.huntComplete) {
                       event.reply("scavengerhunt-complete", { activities: _.shuffle(avaliableActivities).slice(0, 9) });
                    }
                }
            }
        }
    }
    return;
}