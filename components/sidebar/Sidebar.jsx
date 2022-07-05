import { SidebarMenu, ProfileSidebar, WormSpinner } from "../";
import { useEffect, useState } from "react";
import useMediaQuery from '../../hooks/useMediaQuery';


const Sidebar = ({ userDetails, profile }) => {

  const smallDevices = useMediaQuery('(max-width: 660px)');


  return (
    <div className="sidebar-container">
        { !smallDevices && (
          <div className="sidebar-top">
            <div 
             style={profile?.profileBackDropURL ? { backgroundImage: `url(${profile.profileBackDropURL})`} : null}
             className="profile-details-container"
            >
             <div className={"home-image-container"}>
               { userDetails?.imageUrl && (
                   <img 
                     className="home-profile-image"
                     src={userDetails?.imageUrl && userDetails.imageUrl}
                     // src={loggedInUser?.profileImage? urlFor(loggedInUser.profileImage?.asset._ref) : loggedInUser?.imageUrl }
                     alt="profile img"
                   />
               )
             }
             { !userDetails.imageUrl && (
               <div className="home-profile-image">
                 <WormSpinner />
               </div>)
             }
             </div>
            </div>
          </div>)
        }
      <SidebarMenu />
    </div>
  )
}

export default Sidebar