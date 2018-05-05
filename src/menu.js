const postbacks = require('./postbacks');

module.exports =  [
    {
        title: "🎉 Activities",
        type: "postback",
        payload: postbacks.BEGIN_ADVENTURE
    },

    {
        type: "web_url",
        title: "🎫 My Adventure",
        url: "dev.andybot.org/me",
        webview_height_ratio: "full"
    },

    // {
    //     title: "🎫 My Adventure",
    //     type: "nested",
    //     call_to_actions: [
    //         {
    //             title: "📷 Scan Stamp",
    //             type: "postback",
    //             payload: postbacks.SCAN_STAMP
    //         },
    //         {
    //             title: "📈 Check Progress",
    //             type: "postback",
    //             payload: postbacks.CHECK_PROGRESS
    //         },
    //         {
    //             title: "🎟️ Upcoming Opportunities",
    //             type: "postback",
    //             payload: postbacks.OPPORTUNITIES
    //         }
    //     ]
    // },
    {
        title: "💁 Help",
        type: "nested",
        call_to_actions: [
            {
                title: "How to Play",
                type: "postback",
                payload: postbacks.HOW_TO_PLAY
            },
            // {
            //     title: "Museum of Art",
            //     type: "postback",
            //     payload: postbacks.ABOUT_CMOA
            // },
            // {
            //     title: "Andy Warhol",
            //     type: "postback",
            //     payload: postbacks.ABOUT_WARHOL
            // },
            // {
            //     title: "Membership",
            //     type: "postback",
            //     payload: postbacks.ABOUT_MEMBERSHIP
            // },
            {
                type: "web_url",
                title: "CMP Website",
                url: "https://carnegiemuseums.org/",
                webview_height_ratio: "full"
            }
        ]
    }
]