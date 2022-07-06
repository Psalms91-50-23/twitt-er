
export const queryOtherUsers = (userId) => {
    return `*[_type == "user" && _id != '${userId}']`
}

export const queryUser = (userId) => {
    return `*[_type == "user" && _id == '${userId}'][0]`
}

export const queryUserTweets = (userId) => {
    return `*[_type == "tweet" && tweetedBy._ref == '${userId}'] | order(_createdAt desc)`
}

export const queryProfile = (userId) => {
    return `*[_type == "profile" && userId._ref =='${userId}'][0]`
}

export const queryAllUsers = () => {
    return '*[_type == "user"]|order(_createdAt desc)';
}

export const queryTweet = (id) => {
    return `*[_type=="tweet" && _id == '${id}']`;
}