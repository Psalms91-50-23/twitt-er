import { useState } from 'react';
import ReactPlayer from 'react-player';
import { WormSpinner } from '../';
import { ImCross } from "react-icons/im";
import { FaRegComment, FaComment } from "react-icons/fa";
import { FiShare } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { AiOutlineRetweet, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useStateContext } from '../../context/StateContext';
import { format } from 'timeago.js';
import { TweetIcon } from "../";
import { useRouter } from 'next/router';

const Tweet = ({ tweet, user }) => {

  const { deleteTweet, currentUserProfile } = useStateContext();
  const router = useRouter();
  const [dateOfTweet, setDateOfTweet] = useState(tweet._createdAt);
  const [isSelected, setIsSelected] = useState(false);
  

  const iconContainer = {
    display: "flex",
    alignItems: "center",
    color: "rgba(29,155,240,1)",
    cursor: "pointer",
    transition: "all 0.1s ease-in-out",
    fontWeight: "500"
  }

  return (
    <div className="tweet-container">
      <div className="tweet-triangle-speech"></div>
      <span className="birdie-tweet"></span>
      { router.pathname == "/home" && (
        <span 
          className="delete-tweet"
          onClick={() => deleteTweet(tweet._id)}
        >
          <ImCross size={20}/>
        </span>
      )
      }
      <div className="tweet-user-image">
        { user?.imageUrl && (
          <>
            <img 
              className="tweet-user-image"
              src={ user?.imageUrl && user.imageUrl } alt="profile image" 
            />
            <span className="verified">
              <MdVerified size={15}/>
            </span>
          </>
        )
        }
        { !user?.imageUrl && ( 
          <div className="tweet-worm-loading">
            <WormSpinner />
          </div>
        )
        }
      </div>
      <div className="tweet-contents">
        <div className="tweet-text">
          { currentUserProfile && (
            <p className="profile-name">
              { currentUserProfile.firstName && (
                <span>{currentUserProfile.firstName}{" "}</span>
              )
              }
              { currentUserProfile.lastName && (
                <span>{currentUserProfile.lastName}</span>
              )
              }
            </p>
          )
          }
          { tweet.tweetTitle && (
            <p className="tweet-msg">  
              {tweet.tweetTitle}
            </p>
          )
          }
          { dateOfTweet && (
            <p className="date-of-tweet">
              <span className="tweet-date-time">{format(new Date(dateOfTweet).getTime())}</span>
            </p>
          )
          }
        </div>
        <div className="tweet-url-container">
          { tweet.tweetImageUrl && (
            <img 
              className="tweeted-image"
              src={tweet.tweetImageUrl && tweet.tweetImageUrl} alt="tweeted image" 
            />
            )
          }
          {
            tweet.tweetVideoUrl && (   
            <ReactPlayer 
              className="react-player"
              controls={true}
              muted={false}
              url={tweet.tweetVideoUrl}
              width="auto"
            />
          )
          }
          { tweet && (
            <div className="icons-tweet-container">
              <TweetIcon 
                unselectedIcon={<FaRegComment size={15}/>} 
                selectedIcon={<FaComment />}
                setIsSelected={setIsSelected}
                isSelected={isSelected}
                iconContainer={iconContainer}
                counter={Math.floor(Math.random()*1000)}
                tooltip="Reply"
              />
              <TweetIcon 
                unselectedIcon={<AiOutlineRetweet size={15}/>} 
                selectedIcon={<AiOutlineRetweet />}
                setIsSelected={setIsSelected}
                isSelected={isSelected}
                iconContainer={{...iconContainer, color: "rgba(0, 128, 0, 0.7)"}}
                counter={Math.floor(Math.random()*1000)}
                tooltip="Retweet"
              />
              <TweetIcon 
                unselectedIcon={<AiOutlineHeart size={15}/>}
                selectedIcon={<AiFillHeart size={15}/>}
                setIsSelected={setIsSelected}
                isSelected={isSelected}
                iconContainer={{...iconContainer, color: "rgba(255, 0, 0, 0.7)"}}
                counter={Math.floor(Math.random()*1000)}
                tooltip="Like"
              />
              <TweetIcon 
                unselectedIcon={<FiShare  size={15}/>}
                setIsSelected={setIsSelected}
                isSelected={isSelected}
                iconContainer={{...iconContainer,color: "rgba(29,155,240,0.7)"}}
                tooltip="Share"
              />
            </div>
          )
          }
        </div>
      </div>
    </div>
  )
}

export default Tweet