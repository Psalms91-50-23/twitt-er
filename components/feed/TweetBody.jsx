import { Tweet } from '..';
import { useState, useEffect } from 'react';
import { useStateContext } from '../../context/StateContext';

const TweetBody = () => {
  const { 
    user, 
    isLoading,
    currentUserTweets } = useStateContext();

  const [tweets, setTweets] = useState([]);
    
  useEffect(() => {
    if(currentUserTweets){
      setTweets(currentUserTweets);
    }
  }, [currentUserTweets, setTweets])

  useEffect(() => {
    if(!isLoading){
      setTweets(currentUserTweets);
    }
  }, [isLoading, setTweets, currentUserTweets])
  
  if(typeof window === "undefined"){
    <div className=""><span>Loading...</span></div>
  }

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