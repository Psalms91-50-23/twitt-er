import { News } from "../index";

const FeedWidget = ({news}) => {
  console.log({news})
  return (
    <div className="feed-widget-container">
      <div className="feed-widget-content">
        <h1>Latest News</h1>
        { news?.length && news.map((newz, index) => (
          <News 
            newz={newz}
            key={`${newz.id}_${index}`}
          />
        ))
        }

      </div>
    </div>
  )
}

export default FeedWidget