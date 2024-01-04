
import { useEffect, useState } from 'react';
import { useStateContext } from '../../context/StateContext';
import { AiOutlineSearch } from 'react-icons/ai';
import backgroundStyles from "../../styles/module/Background.module.scss"
import { 
  SidebarMenu, 
  OtherUserFeed, 
  OtherTweetHead,
  ProfileWidget } from '../../components';
import useMediaQuery from '../../hooks/useMediaQuery';
import { WormSpinner } from '../../components';

const Profile = ({ 
  userTweets, 
  user, 
  profile, 
  otherUsers }) => {
  
  const mediumToLargeDevices = useMediaQuery('(min-width: 905px)');
  const { setOtherUsers, setCurrentUserProfile } = useStateContext(); 
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [name, setName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, [])
  
  useEffect(() => {
    setOtherUsers(otherUsers)
  }, [setOtherUsers, otherUsers])

  useEffect(() => {
    if(name){
      const usersFiltered = otherUsers.filter(user => user.userName.toLowerCase().includes(name.toLowerCase()));
      setFilteredUsers(usersFiltered)
    }else {
      setFilteredUsers([])
    }
  }, [name,otherUsers,setFilteredUsers])
  
  useEffect(() => {
    setCurrentUserProfile(profile);
  }, [setCurrentUserProfile,profile])
  
  if(!isLoaded){
    return (
      <div className={backgroundStyles.moving_clouds_behind}>
        <div className="spinner-bg-container">
          <div className="spinner-bg-content">
            <WormSpinner />
          </div>
        </div>
      </div>
    )
  }

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
          <div className="other-user-widget-container">
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
            <ProfileWidget 
              users={ filteredUsers?.length ? filteredUsers 
              : otherUsers}
            />
        </div>
        )
        }
      </div>
    </div>  
  )
}

export const getServerSideProps = async ({ params: { user_id }, req, res }) => {

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

  const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/${user_id}`, {
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    method: "POST",
    body: JSON.stringify({ userId })
  }).then(res => res.json());

  const { 
    user, 
    userTweets, 
    bingNewsData, 
    profile, 
    otherUsers } = data;
  return {
    props: {
      user,
      userTweets,
      profile,
      otherUsers
    },
  }
}

export default Profile