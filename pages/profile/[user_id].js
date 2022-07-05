
import { useRouter } from 'next/router';
import axios from 'axios';
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

const Profile = ({ userTweets, user, profile, otherUsers }) => {

  const mediumToLargeDevices = useMediaQuery('(min-width: 905px)');
  const { setOtherUsers } = useStateContext(); 
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [name, setName] = useState("");

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
            <ProfileWidget users={ filteredUsers?.length ? filteredUsers : otherUsers}/>
        </div>
        )
        }
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ params: { user_id }}) => {

  const data = await axios.get(`${process.env.NEXT_BASE_URL}/profile/${user_id}`);
  const { user, userTweets, 
    // newsData, 
    profile, otherUsers } = data;
  return {
    props: {
      user,
      userTweets,
      profile,
      // newsData,
      otherUsers
    },
  }
}

export default Profile