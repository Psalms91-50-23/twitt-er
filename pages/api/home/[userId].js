import { sanityBaseURL } from "../../../lib/functions";
import { queryOtherUsers, queryUser, queryUserTweets, queryProfile } from "../../../lib/queries";

export default async function handler(req, res) {
    const headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    headers.append('Access-Control-Allow-Headers', 'Content-Type');

    if(req.method === "GET"){
        const { userId } = req.query;
        var userQuery = encodeURIComponent(queryUser(userId));
        var otherUsersQuery = encodeURIComponent(queryOtherUsers(userId));
        var profileQuery = encodeURIComponent(queryProfile(userId));
        var userTweetsQuery = encodeURIComponent(queryUserTweets(userId));
        var searchQuery = "latest news";
        let tempURL = `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${process.env.NEXT_PUBLIC_NEWSAPI_KEY}`
        const bingNewsOptions = {
            method: 'GET',
            url: 'https://bing-news-search1.p.rapidapi.com/news/search',
            params: {q: 'latest', safeSearch: 'Off', textFormat: 'Raw', freshness: 'Day'},
            headers: {
                'X-BingApis-SDK': 'true',
                'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_BING_NEWS_SEARCH_API_KEY,
                'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
            }
        }
        const newsAPI = {
            method: 'GET',
            url: 'https://bing-news-search1.p.rapidapi.com/news/search',
            params: {q: 'latest', safeSearch: 'Off', textFormat: 'Raw', freshness: 'Day'},
            headers: {
                'X-BingApis-SDK': 'true',
                'X-RapidAPI-Key': process.env.NEXT_PUBLIC_NEWSAPI_KEY,
                'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
            }
        }
        try {
            const results = await Promise.all([
                fetch(`${sanityBaseURL}${userTweetsQuery}`), 
                fetch(`${sanityBaseURL}${profileQuery}`), 
                fetch(`${sanityBaseURL}${userQuery}`),
                fetch(`${sanityBaseURL}${otherUsersQuery}`),
                fetch(`${tempURL}`),
                // fetch(`https://bing-news-search1.p.rapidapi.com/news/search?q=${searchQuery}&freshness=Day&textFormat=Raw&safeSearch=Off`, {headers,...newsAPI}),
                // fetch('https://current-news.p.rapidapi.com/news', options),
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

  