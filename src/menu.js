const postbacks = require('./postbacks');

module.exports =  [
    {
        title: "My Adventure",
        type: "nested",
        call_to_actions: [{
                title: "Scan Stamp",
                type: "postback",
                payload: postbacks.SCAN_STAMP
            },
            {
                title: "Check Progress",
                type: "postback",
                payload: postbacks.CHECK_PROGRESS
            },
            {
                title: "Upcoming Opportunities",
                type: "postback",
                payload: postbacks.OPPORTUNITIES
            }
        ]
    },
    {
        title: "FAQ",
        type: "nested",
        call_to_actions: [{
                title: "About Summer Adventure",
                type: "postback",
                payload: postbacks.ABOUT_SUMMER_ADVENTURE
            },
            {
                title: "Museum of Art",
                type: "postback",
                payload: postbacks.ABOUT_CMOA
            },
            {
                title: "Andy Warhol",
                type: "postback",
                payload: postbacks.ABOUT_WARHOL
            },
            {
                title: "Membership",
                type: "postback",
                payload: postbacks.ABOUT_MEMBERSHIP
            }
        ]
    },
    {
        type: "web_url",
        title: "Website",
        url: "https://www.carnegiemuseums.org/",
        webview_height_ratio: "full"
    }
]