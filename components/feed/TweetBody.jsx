import { Tweet } from '..';
import { useState, useEffect } from 'react';
import { useStateContext } from '../../context/StateContext';
import { useRouter } from 'next/router';

const TweetBody = ({ userTweets, tweetUser }) => {
  const { 
    user, 
    isLoading,
    currentUserTweets } = useStateContext();
  const router = useRouter();
  // const url = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-03-25/data/query/development?query=*[ _type == "tweet"&&tweetedBy._ref=="${user._id}]`;
  const [currentUser, setCurrentUser] = useState(user);
  const [tweets, setTweets] = useState([]);
    
  useEffect(() => {
    //loads initial tweets
    if(currentUserTweets){
      setTweets(currentUserTweets);
    }
  }, [currentUserTweets])

  useEffect(() => {
    //updates tweets after loading goes to falsy
    if(!isLoading){
      setTweets(currentUserTweets);
    }
  }, [isLoading])
  

  return (
    <div className="feed-tweet-body-container">
      { 
        tweets?.length ? tweets.map((tweet, index) => (
          <Tweet 
            tweet={tweet} 
            key={tweet._id} 
            user={user}
            index={index}
          />
        ))
      :
      <div className="welcome-container">
          <h1 className="feed-welcome-msg"> Welcome to Twitt-Er {user?.userName}</h1>
          <div className="welcome-birdie">
            <div className="speech-box">
              <span className="speech-bird-msg">tweet tweet</span>
              <span className="extend-speech"></span>
            </div>
          </div>
      </div>
      }
  </div>
  )
}

export default TweetBody