import { sanityBaseURL } from "../../../lib/functions";
import { queryOtherUsers, queryUser, queryUserTweets, queryProfile } from "../../../lib/queries";

export default async function handler(req, res) {

    if(req.method === "GET"){
        const { userId } = req.query;
        const userQuery = encodeURIComponent(queryUser(userId));
        const otherUsersQuery = encodeURIComponent(queryOtherUsers(userId));
        const profileQuery = encodeURIComponent(queryProfile(userId));
        const userTweetsQuery = encodeURIComponent(queryUserTweets(userId));

        const options = {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_CURRENT_NEWS_API_KEY,
              'X-RapidAPI-Host': 'current-news.p.rapidapi.com'
            }
        };

        try {
            const results = await Promise.all([
                fetch(`${sanityBaseURL}${userTweetsQuery}`), 
                fetch(`${sanityBaseURL}${profileQuery}`), 
                fetch(`${sanityBaseURL}${userQuery}`),
                fetch(`${sanityBaseURL}${otherUsersQuery}`),
                // fetch('https://current-news.p.rapidapi.com/news', options),
            ])
            const finalData = await Promise.all(results.map(result => result.json()));
            res.status(200).json({ 
                tweets: finalData[0].result, 
                profile: finalData[1].result, 
                currentUser: finalData[2].result,
                otherUsers: finalData[3].result
                // newsData: finalData[4].news, 
            });
        }catch(error){
            console.log(error.message);
        }

    }
}
  