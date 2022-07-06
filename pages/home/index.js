
import { useEffect } from 'react';
import { useStateContext } from '../../context/StateContext';
import { Sidebar, Feed, UserWidget } from '../../components';
import useMediaQuery from '../../hooks/useMediaQuery';
import backgroundStyles from "../../styles/module/Background.module.scss";

const Home = ({ 
  currentUser, 
  tweets, 
  otherUsers, 
  profile, 
  newsData 
}) => {

  const mediumDevice = useMediaQuery('(min-width: 905px)');
  const { 
    setCurrentUserTweets, 
    setUser, 
    setOtherUsers,
    setLatestNews, 
    setCurrentUserProfile } = useStateContext();
  const { _id, userName, imageUrl, profileImage } = currentUser;

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser, setUser])
  
  useEffect(() => {
    setLatestNews(newsData);
  }, [newsData,setLatestNews])
  
  useEffect(() => {
    setOtherUsers(otherUsers);
  }, [otherUsers, setOtherUsers])

  useEffect(() => {
     setCurrentUserTweets(tweets);
  }, [tweets, setCurrentUserTweets])
  
  useEffect(() => {
    setCurrentUserProfile(profile);
  }, [profile, setCurrentUserProfile]) 

  return (
    <div className="home-container">
      <div className={backgroundStyles.moving_clouds_behind}>
       <div className={backgroundStyles.moving_bird_container}>
        <div className={backgroundStyles.moving_clouds_front}>
            <Sidebar 
              userDetails={currentUser} 
              profile={profile}
            />
            <Feed />
            { mediumDevice && (
              <UserWidget news={newsData}/>
            )
            }
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
  const { 
    currentUser, 
    tweets,
    newsData, 
    otherUsers, 
    profile } = data;
  return {
    props: { 
      token: req.cookies.token || "",
      currentUser: currentUser ? currentUser : [],
      tweets: tweets ? tweets : [],
      otherUsers: otherUsers ?  otherUsers: [],
      profile: profile ? profile : [],
      newsData: newsData ? newsData : []
    },
  }
}

export default Home