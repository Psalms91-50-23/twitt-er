import { SidebarMenu, ProfileSidebar } from "../";
import useMediaQuery from '../../hooks/useMediaQuery';


const Sidebar = ({ userDetails, userProfile }) => {

  const smallDevices = useMediaQuery('(max-width: 660px)');

  return (
    <div className="sidebar-container">
        { !smallDevices && (
            <ProfileSidebar 
              user={userDetails}
              userProfile={userProfile}
            />
          )
        }
      <SidebarMenu />
    </div>
  )
}

export default Sidebar