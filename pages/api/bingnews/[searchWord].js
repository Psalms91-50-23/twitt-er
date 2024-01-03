export default async function handler(req, res) {

    if(req.method === "GET"){
        const { searchWord } = req.query;
        var splitQueryArray = searchWord.split(" ");
        
        const optionsOne = {
            method: 'GET',
            headers: {
                'X-BingApis-SDK': 'true',
                'X-RapidAPI-Key': '4ed20315eemsh401f1799edc76b8p1392f1jsn07280cd69cfa',
                'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
            }
        };

        fetch('https://bing-news-search1.p.rapidapi.com/news/search?q=latest%20news&safeSearch=Off&textFormat=Raw&freshness=Day', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
    

        var options = {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': "4ed20315eemsh401f1799edc76b8p1392f1jsn07280cd69cfa",
            //   'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_CURRENT_NEWS_API_KEY,
              'X-RapidAPI-Host': 'current-news.p.rapidapi.com'
            }
        };

        var bingNewsOptions = {
            method: 'GET',
            url: 'https://bing-news-search1.p.rapidapi.com/news/search',
            params: {q: 'world economy', safeSearch: 'Off', textFormat: 'Raw', freshness: 'Day'},
            headers: {
                'X-BingApis-SDK': 'true',
                'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_BING_NEWS_SEARCH_API_KEY,
                'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
            }
        }
    };

    try {
        const results = await Promise.all([
            fetch('https://current-news.p.rapidapi.com/news', bingNewsOptions),
        ])
        const finalData = await Promise.all(results.map(result => result.json()));
        res.status(200).json({ 
            bingNewsData: finalData[0].news
        });
    }catch(error){
            console.log(error.message);
    }

}