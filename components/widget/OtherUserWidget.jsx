import { FollowsWidget, NewsWidget } from "../";

const OtherUserWidget = ({newsData}) => {
  return (
    <div className="other-user-widget">
      <div className="other-user-news-container">
        <NewsWidget newsData={newsData}/>
      </div> 
      <div className="other-user-follows-container">
        <FollowsWidget />
      </div> 
    </div>
  )
}

export default OtherUserWidget