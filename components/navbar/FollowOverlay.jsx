import { useState, useEffect } from 'react';
import { useStateContext } from '../../context/StateContext';
import { ProfileWidget } from '../widget';
import { AiOutlineRight, AiOutlineSearch } from "react-icons/ai";

const FollowOverlay = () => {
    const { otherUsers, isShowFollows, setIsShowFollows } = useStateContext();
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [name, setName] = useState("");

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
      

  return (
    <div className="follow-container">
        <div className="follow-contents">
            <div className="search-news-container">
                <span className="search-icon">
                    <AiOutlineSearch size={30}/>
                </span>
                <input 
                    autoComplete="off"
                    className="search-input-follow"
                    type="text" 
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <ProfileWidget users={ filteredUsers?.length? filteredUsers : otherUsers}/>
            <div className="exit-container">
                <span 
                    className="exit-button"
                    onClick={() => setIsShowFollows(!isShowFollows)}
                >
                    <AiOutlineRight size={40}/>
                </span>
            </div>
        </div>
    </div>
  )
}

export default FollowOverlay