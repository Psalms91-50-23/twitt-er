export default {
    name: 'comment',
    title: 'Comment',
    type: 'document',
    fields: [
        {
            name: 'tweetId',
            title: 'Tweet ID',
            type: 'string'
        },
        {
            name: 'comment',
            title: 'Comment',
            type: 'string'
        },
        {
            name: 'tweetedBy',
            title: 'TweetedBy',
            type: 'tweetedBy'
        },
        {
            name: 'blockTweet',
            title: 'Block Tweet',
            description: 'ADMIN Controls: Toggle if Tweet is deemed inappropriate',
            type: 'boolean' 
        }
    ]
}