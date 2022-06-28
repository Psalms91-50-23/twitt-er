
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getCurrentUserTweetQuery, getUserQuery } from '../../query';
import Cookie from "js-cookie";
import { client, urlFor } from '../../lib/client';
import { useStateContext } from '../../context/StateContext';
import { ImCross } from "react-icons/im";
import { AiOutlineSearch } from 'react-icons/ai';
import backgroundStyles from "../../styles/module/Background.module.scss"
import { 
  SidebarMenu, 
  OtherUserWidget, 
  OtherUserFeed, 
  OtherTweetHead,
  ProfileWidget } from '../../components';
import useMediaQuery from '../../hooks/useMediaQuery';
import { AiOutlineMenu } from 'react-icons/ai';

const dashboard = ({  userTweets, user, profile, newsData, otherUsers }) => {

  const router = useRouter();
  console.log("newsss ", newsData);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [name, setName] = useState("");
  // console.log("in other profile user ", user);
  if( typeof window != "undefined" && router.isFallback){
    return (
      <div className="">
        Loading...
      </div>
    )
  }

  const { setOtherUsers } = useStateContext(); 

  useEffect(() => {
    setOtherUsers(otherUsers)
  }, [])

  useEffect(() => {
    if(name){
      console.log("1")
      const usersFiltered = otherUsers.filter(user => user.userName.toLowerCase().includes(name.toLowerCase()));
      console.log({usersFiltered});
      setFilteredUsers(usersFiltered)
    }else {
      console.log("2");
      setFilteredUsers([])
    }
  }, [name,otherUsers])
  

  const mediumToLargeDevices = useMediaQuery('(min-width: 905px)');
  const smallToMediumDevices = useMediaQuery('(max-width: 660px)');

  const [isLoading, setIsLoading] = useState(true);
  const mediumDevice = useMediaQuery('(min-width: 905px)');
  console.log({user});
    console.log({userTweets});
  return (
    <div className={backgroundStyles.moving_clouds_behind}>
      <div className="other-user-home-container">
        <div className="sidebar-buttons-container">
          <SidebarMenu />
        </div>
        <div className="other-user-feed-container">
          <OtherTweetHead profile={profile} user={user} />
          <OtherUserFeed user={user} userTweets={userTweets} />
        </div>
        { mediumToLargeDevices && (
          <div className="current-user-widget-container">
            <div className="search-people-container">
              <input 
                className="search-input"
                type="text" 
                name="name"
                onChange={(e) => setName(e.target.value)}
              />
              <span className="search-icon">
                <AiOutlineSearch size={25}/>
              </span>
            </div>
            <ProfileWidget users={ filteredUsers?.length ? filteredUsers : otherUsers}/>
        </div>
        )
        }
      </div>
    </div>
  )
}

// export const getStaticPaths = async () => {

//   const query = `*[_type == "user"]`
//   const url = `https://r3d2pmc2.api.sanity.io/v2022-05-10/data/query/development?query=${query}`;
//   const users = await fetch(url).then( res => res.json());
//   const paths = users.result.map((user) => ({
//       params: {
//           user_id: `${user._id}`
//       }
//   }))
//   return {
//       paths,
//       fallback: true
//   }

// }

// export const getStaticProps = async ({ params: { user_id }}) => {
  
//   const userQuery = encodeURIComponent(`*[_type == "user" && _id == '${user_id}'][0]`);
//   const tweetsQuery = encodeURIComponent(`*[_type == "tweet" && tweetedBy._ref == '${user_id}'] | order(_createdAt desc)`);
//   const url =  `https://r3d2pmc2.api.sanity.io/v2022-05-10/data/query/development?query=`;
//   const user = await fetch(`${url}${userQuery}`)
//   .then( res => res.json())
//   .catch(error => console.log(error.message));

//   const userTweets = await fetch(`${url}${tweetsQuery}`)
//   .then( res => res.json())
//   .catch(error => console.log(error.message));
//   console.log("user tweets, ", userTweets.result);

//   return {
//     props: {
//       user: user.result,
//       userTweets: userTweets.result
//     }
//   }
// }

export const getServerSideProps = async ({ params: { user_id}}) => {

  const userQuery = encodeURIComponent(`*[_type == "user" && _id == '${user_id}'][0]`);
  const usersQuery = encodeURIComponent(`*[_type == "user" && _id != '${user_id}']`);
  const userProfileQuery = encodeURIComponent(`*[_type == "profile" && _id == '${user_id}'][0]`);
  const tweetsQuery = encodeURIComponent(`*[_type == "tweet" && tweetedBy._ref == '${user_id}'] | order(_createdAt desc)`);
  const url =  `https://r3d2pmc2.api.sanity.io/v2022-05-10/data/query/development?query=`;

  const user = await fetch(`${url}${userQuery}`)
  .then(res => res.json())
  .catch(error => console.log(error.message));

  const users = await fetch(`${url}${usersQuery}`)
  .then(res => res.json())
  .catch(error => console.log(error.message));

  const userTweets = await fetch(`${url}${tweetsQuery}`)
  .then( res => res.json())
  .catch(error => console.log(error.message));

  const userProfile = await fetch(`${url}${userProfileQuery}`)
  .then( res => res.json())
  .catch(error => console.log(error.message));

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_CURRENT_NEWS_API_KEY,
      'X-RapidAPI-Host': 'current-news.p.rapidapi.com'
    }
  };

  let newsData = await fetch('https://current-news.p.rapidapi.com/news', options)
    .then(response => response.json())
    // .then(response => newsData = response)
    .catch(err => console.error(err));
  // console.log("user tweets, ", userTweets.result);

  return {
    props: {
      user: user.result,
      userTweets: userTweets.result,
      profile: userProfile.result,
      newsData,
      otherUsers: users.result
    },
  }
}

export default dashboard