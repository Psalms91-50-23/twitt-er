import { sanityBaseURL } from "../../../lib/functions";
import { queryOtherUsers, queryUser, queryUserTweets, queryProfile } from "../../../lib/queries";

export default async function handler(req, res) {
    const headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    //this one
    if(req.method === "GET"){
        const { userId } = req.query;
        var userQuery = encodeURIComponent(queryUser(userId));
        var otherUsersQuery = encodeURIComponent(queryOtherUsers(userId));
        var profileQuery = encodeURIComponent(queryProfile(userId));
        var userTweetsQuery = encodeURIComponent(queryUserTweets(userId));
        var searchQuery = "latest news";
        let newsURL = `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${process.env.NEXT_PUBLIC_NEWSAPI_KEY}`
        
        try {
            const results = await Promise.all([
                fetch(`${sanityBaseURL}${userTweetsQuery}`), 
                fetch(`${sanityBaseURL}${profileQuery}`), 
                fetch(`${sanityBaseURL}${userQuery}`),
                fetch(`${sanityBaseURL}${otherUsersQuery}`),
                fetch(`${newsURL}`),
            ])
            const finalData = await Promise.all(results.map(async (result) => {
                if (!result.ok) {
                    throw new Error(`Network response was not ok: ${result.statusText}`);
                }
 
                const contentType = result.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error(`Expected JSON response but received ${contentType}`);
                }
                return result.json()
            }));
            res.status(200).json({ 
                tweets: finalData[0].result, 
                profile: finalData[1].result, 
                currentUser: finalData[2].result,
                otherUsers: finalData[3].result,
                bingNewsData: finalData[4].articles
            });
        }catch(error){
                console.log(error.message);
                res.status(500).json({ error: 'Internal Server Error' });
        }
    };
    
}

  