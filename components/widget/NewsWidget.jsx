import { News } from "../"

const NewsWidget = ({newsData}) => {
  return (
    <div className="news-widget-container">
        <h1>Latest News</h1>
        { newsData?.length ? newsData.map(news => (
            <News newz={news} key={news.id}/>
        ))
        : null
        }
    </div>
  )
}

export default NewsWidget