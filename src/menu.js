const postbacks = require('./postbacks');

module.exports =  [
    {
        title: "🎉 Activities",
        type: "postback",
        payload: postbacks.BEGIN_ADVENTURE
    },

    {
        type: "web_url",
        title: "🎫 My Stamps",
        url: "https://carnegiebot.org/me",
        webview_height_ratio: "full",
        messenger_extensions: true
    },
    {
        title: "💁 More Info",
        type: "nested",
        call_to_actions: [
            {
                title: "How to Play",
                type: "postback",
                payload: postbacks.HOW_TO_PLAY
            },
            {
                type: "web_url",
                title: "Frequently Asked Questions",
                url: "https://carnegiebot.org/faq/",
                webview_height_ratio: "full"
            },
            {
                type: "web_url",
                title: "Art Credits",
                url: "https://carnegiebot.org/artworkcredits/",
                webview_height_ratio: "full"
            },
            {
                type: "web_url",
                title: "Carnegie Museums of Pittsburgh",
                url: "https://carnegiemuseums.org/",
                webview_height_ratio: "full"
            }
        ]
    }
]