import { useEffect } from 'react';
import { useStateContext } from '../../context/StateContext';
import { Sidebar, Feed, FeedWidget } from '../../components';
import useMediaQuery from '../../hooks/useMediaQuery';
import backgroundStyles from "../../styles/module/Background.module.scss";

const Home = ({ foundUser, tweets, users, profile, newsData }) => {
    
  const mediumDevice = useMediaQuery('(min-width: 905px)');
  const { 
    setCurrentUserTweets, 
    setUser, 
    setOtherUsers,
    setTweetClicked, 
    setLatestNews } = useStateContext();
  const { _id, userName, imageUrl, profileImage } = foundUser;
  useEffect(() =>{
    setUser({_id, userName, imageUrl, profileImage });
    setCurrentUserTweets(tweets);
    setOtherUsers(users);
    setLatestNews(newsData);
  },[_id, userName, imageUrl, profileImage, users, 
    newsData, setOtherUsers, setOtherUsers, setCurrentUserTweets, 
    setUser, tweets]) 


  return (
    <div className="home-container">
      <div className={backgroundStyles.moving_clouds_behind}>
       <div className={backgroundStyles.moving_bird_container}>
        <div className={backgroundStyles.moving_clouds_front}>
            <Sidebar 
              userDetails={foundUser} 
              setTweetClicked={setTweetClicked}
              userProfile={profile}
            />
            <Feed />
            { mediumDevice && (
              <FeedWidget news={newsData.news}/>
            )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async({ req, res }) => {

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

  const userQuery = encodeURIComponent(`*[_type == "user" && _id =='${userId}']`);
  const usersQuery = encodeURIComponent(`*[_type == "user" && _id != '${userId}']`);
  const profileQuery = encodeURIComponent(`*[_type == "profile" && userId._ref =='${userId}']`);
  const userTweetsQuery = encodeURIComponent(`*[_type == "tweet" && tweetedBy._ref == '${userId}'] | order(_createdAt desc)`);

  const baseURL = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/development?query=`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_CURRENT_NEWS_API_KEY,
      'X-RapidAPI-Host': 'current-news.p.rapidapi.com'
    }
  };

  let newsData = await fetch('https://current-news.p.rapidapi.com/news', options)
    .then(response => response.json())
    .catch(err => console.error(err));

  const userTweets = await fetch(`${baseURL}${userTweetsQuery}`).then(res => res.json());
  const userProfile = await fetch(`${baseURL}${profileQuery}`).then(res => res.json());
  const foundUser = await fetch(`${baseURL}${userQuery}`).then(res => res.json());
  const users = await fetch(`${baseURL}${usersQuery}`).then(res => res.json());

  return {
    props: { 
      token: req.cookies.token ? req.cookies.token : "",
      foundUser: foundUser.result? foundUser.result[0] : null ,
      tweets: userTweets.result ? userTweets.result : [],
      users: users.result,
      profile: userProfile.result,
      newsData
    },
  }
}

export default Home