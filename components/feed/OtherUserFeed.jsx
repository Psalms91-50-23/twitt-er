import { Tweet } from '../';

const OtherUserFeed = ({ userTweets, user }) => {
  return (
    <div className="other-user-feed">
      { userTweets?.length ? userTweets.map(tweet => (
        <Tweet 
          key={tweet._id}  
          tweet={tweet} 
          user={user}
        />
        ))
        : 
        <>
          <h3 className="no-tweets-msg">Still making up my mind for my first Tweet! 🤔</h3>
          <h4 className="no-tweets-msg">Am I a bird? Am I a plane? Or am I tweeting too much?...</h4>
        </>
      }
    </div>
  )
}

export default OtherUserFeed