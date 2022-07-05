import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useStateContext } from '../../context/StateContext';
import { Sidebar, Feed, UserWidget } from '../../components';
import useMediaQuery from '../../hooks/useMediaQuery';
import backgroundStyles from "../../styles/module/Background.module.scss";

const Home = ({ currentUser, tweets, otherUsers, profile, 
  // newsData 
}) => {
    // console.log("profile in home index ",profile);
    // console.log({newsData})
  const mediumDevice = useMediaQuery('(min-width: 905px)');
  const { 
    setCurrentUserTweets, 
    setUser, 
    setOtherUsers,
    setTweetClicked, 
    setLatestNews, 
    currentUserProfile,
    setCurrentUserProfile } = useStateContext();
  const { _id, userName, imageUrl, profileImage } = currentUser;
  // console.log({ currentUser });
  // console.log({currentUserProfile})

  useEffect(() => {
    setUser(currentUser);
    // setUser({_id, userName, imageUrl, profileImage });
  }, [currentUser, setUser])
  
  // useEffect(() => {
  //   setLatestNews(newsData);
  // }, [newsData])
  
  useEffect(() => {
    setOtherUsers(otherUsers);
  }, [otherUsers])

  useEffect(() => {
     setCurrentUserTweets(tweets);
  }, [tweets])
  
  useEffect(() => {
    setCurrentUserProfile(profile);
  }, [profile]) 

  return (
    <div className="home-container">
      <div className={backgroundStyles.moving_clouds_behind}>
       <div className={backgroundStyles.moving_bird_container}>
        <div className={backgroundStyles.moving_clouds_front}>
            <Sidebar 
              userDetails={currentUser} 
              // setTweetClicked={setTweetClicked}
              profile={profile}
            />
            <Feed />
            {/* { mediumDevice && (
              <UserWidget news={newsData}/>
            )
            } */}
          </div>
        </div>
      </div>
    </div>
  )

}

export const getServerSideProps = async ({ req, res }) => {

  if(!req.cookies.token){
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }
  let userId;
  if(req.cookies.token){
    userId = req.cookies.token.split(process.env.NEXT_PUBLIC_SECRET)[0];
  }
  const url = `${process.env.NEXT_BASE_URL}/api/home/${userId}`;
  const data = await fetch(url).then(res => res.json());
  const { currentUser, tweets,
    //  newsData, 
     otherUsers, profile } = data;
  return {
    props: { 
      token: req.cookies.token || "",
      currentUser: currentUser ? currentUser : [],
      tweets: tweets ? tweets : [],
      otherUsers: otherUsers ?  otherUsers: [],
      profile: profile ? profile : [],
      // newsData: newsData ? newsData : []
    },
  }
}

export default Home