import { useStateContext } from "../../context/StateContext";
import { WormSpinner } from "../";
import { urlFor } from "../../lib/client";
import { useState, useEffect } from "react";

const ProfileSidebar = ({user}) => {

  const { currentUserprofile } = useStateContext();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInProfile, setLoggedInProfile] = useState(null);

  useEffect(() => {
    setLoggedInProfile(currentUserprofile);
  }, [currentUserprofile])
  
  useEffect(() => {
    setLoggedInUser(user);
  }, [user])
  

  return (
      <div className="sidebar-top">
        <div 
          style={loggedInProfile?.profileBackDrop ? { backgroundImage: `url(${loggedInProfile.profileBackDrop})`, backgroundSize: 'cover'} : {}}
          className="profile-details-container"
        >
          <div 
            className={"home-image-container"}>
            { (loggedInUser?.profileImage?.asset || loggedInUser?.imageUrl ) ? (
                <img 
                  className="home-profile-image"
                  src={loggedInUser?.profileImage? urlFor(loggedInUser.profileImage?.asset._ref) : loggedInUser?.imageUrl }
                  alt="profile img"
                />
            )
            : (
              <div className="home-profile-image">
                <WormSpinner />
              </div>
            )
            }
          </div>
        </div>
      </div>
  )
}

export default ProfileSidebar