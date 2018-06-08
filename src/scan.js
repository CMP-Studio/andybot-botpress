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
                event.reply("#stamp_unlock", { image, text: "You unlocked a stamp!"});
                return;
            }
        }

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
                    event.reply("#activities",  { activities: avaliableActivities });
                }, 2000);
            }
            return;
        } else if (scanResponse.scan.type === 'activity') {
            const triggeredActivities = scanResponse.scan.trigger;
            const avaliableActivities = _.map(triggeredActivities, (activity_id) => _.find(activities.manifest, (o) => o.activity === activity_id));

            if (utils.isNonNull(scanResponse.scan.followup)){
                setTimeout(() => {
                    event.reply("#text",  { text: scanResponse.scan.followup });
                }, 500);
            }

            setTimeout(() => {
                event.reply("#activities",  { activities: avaliableActivities });
            }, 2000);
            
            return;

        } else if (scanResponse.scan.type === 'scavengerhunt') {

            if (utils.isNonNull(scanResponse.scavengerhunt)){
                if (scanResponse.scavengerhunt.clueNumber === 0) {
                    event.reply("scavengerhunt-firstclue", scanResponse.scavengerhunt);
                    return
                }

                if (scanResponse.scavengerhunt.lastClue === true) {
                    event.reply("scavengerhunt-lastclue", scanResponse.scavengerhunt);
                    return
                }

                if (utils.isNonNull(scanResponse.scavengerhunt.followup)) {
                    event.reply("scavengerhunt-followup-clue", scanResponse.scavengerhunt);
                    return
                } else {
                    event.reply("scavengerhunt-clue", scanResponse.scavengerhunt);
                    return;	
                }
            }
        }
    }
}