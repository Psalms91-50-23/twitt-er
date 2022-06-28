
export const getUserQuery = (userId) => {
    const query = `*[_type == "user" && _id == "${userId}"]`
    return query
}

export const getCurrentUserTweetQuery = (userId) => {
    // console.log("userId ", userId);
    const query = `*[_type == "tweet" && userId == '${userId}'] | order(_createdAt desc)`
    return query
}
