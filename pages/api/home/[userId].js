import { sanityBaseURL } from "../../../lib/functions";
import { queryOtherUsers, queryUser, queryUserTweets, queryProfile } from "../../../lib/queries";

export default async function handler(req, res) {

    if(req.method === "GET"){
        const { userId } = req.query;
        var userQuery = encodeURIComponent(queryUser(userId));
        var otherUsersQuery = encodeURIComponent(queryOtherUsers(userId));
        var profileQuery = encodeURIComponent(queryProfile(userId));
        var userTweetsQuery = encodeURIComponent(queryUserTweets(userId));

        var options = {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': "4ed20315eemsh401f1799edc76b8p1392f1jsn07280cd69cfa",
            //   'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_CURRENT_NEWS_API_KEY,
              'X-RapidAPI-Host': 'current-news.p.rapidapi.com'
            }
        };
        var searchQuery = "latest";
        var bingNewsOptions = {
            method: 'GET',
            url: 'https://bing-news-search1.p.rapidapi.com/news/search',
            params: {q: 'latest', safeSearch: 'Off', textFormat: 'Raw', freshness: 'Day'},
            headers: {
                'X-BingApis-SDK': 'true',
                'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_BING_NEWS_SEARCH_API_KEY,
                'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
            }
        }
    };
    try {
        const results = await Promise.all([
            fetch(`${sanityBaseURL}${userTweetsQuery}`), 
            fetch(`${sanityBaseURL}${profileQuery}`), 
            fetch(`${sanityBaseURL}${userQuery}`),
            fetch(`${sanityBaseURL}${otherUsersQuery}`),
            fetch("https://bing-news-search1.p.rapidapi.com/news/search?q=latest&freshness=Day&textFormat=Raw&safeSearch=Off", bingNewsOptions),
            // fetch('https://current-news.p.rapidapi.com/news', options),
        ])
        const finalData = await Promise.all(results.map(result => result.json()));
        // console.log("bing data ",finalData[4].value);
     
        res.status(200).json({ 
            tweets: finalData[0].result, 
            profile: finalData[1].result, 
            currentUser: finalData[2].result,
            otherUsers: finalData[3].result,
            bingNewsData: finalData[4].value
        });
    }catch(error){
            console.log(error.message);
    }

}

  