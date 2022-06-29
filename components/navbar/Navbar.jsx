
import { AiFillHome } from "react-icons/ai";
import { GiNewspaper } from "react-icons/gi";
import { CgProfile, CgUserList } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import Cookie from 'js-cookie';
import { NavbarIcon, FollowOverlay } from "../"
import { useRouter } from 'next/router';
import { useStateContext } from '../../context/StateContext';
import { TweetOverlay, MenuOverlay, NewsOverlay } from "../"
import { navIconContainer } from '../../styles/custom';
import useMediaQuery from '../../hooks/useMediaQuery';

const Navbar = () => {
  const { 
    user, 
    isTweetClicked,
    setIsTweetClicked,
    isMenuHidden,
    isShowFollows, 
    setIsShowFollows, 
    isNews, 
    setIsNews } = useStateContext();
  const router = useRouter();
  const smallDevices = useMediaQuery('(max-width: 470px)');
  const mediumToLargeDevices = useMediaQuery('(max-width: 905px)');
  
  const handleLogOut = () => {
    Cookie.remove("token");
    router.replace("/")
  }

  const titleStyle = {
    fontWeight: "600",
    color: "rgba(255,255,255,1)"
  }

  const navIconContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginRight: "0px"
  }

  const iconStyle = {
    color: "rgba(255,255,255,1)"
  }

  return (
    <div className="navbar-container">
      <div className="navbar-icon-left-container">
        <NavbarIcon 
          icon={<AiFillHome size={20}/>} 
          title={"Home"}
          borderBottom
          containerStyle={ mediumToLargeDevices &&  {...navIconContainerStyle,
          marginLeft: "0px"} }
          titleStyle={titleStyle}
          iconStyle={iconStyle}
          clickEvent={ router.route !== "/home" ? () => router.push(`/home`) : null }
        />
        <NavbarIcon 
          icon={<CgProfile size={20}/>} 
          profileImg={ user?.profileImage? user?.profileImage : user?.imageUrl }
          title={"Profile"}
          borderBottom
          iconStyle={iconStyle}
          containerStyle={ smallDevices &&  navIconContainer}
          titleStyle={titleStyle}
          clickEvent={ router.route !== "/home/profile/[user_id]" ? () => router.push(`/home/profile/${user?._id}`) : null }
        />
      </div>
      <div className="navbar-icon-right-container">
        <NavbarIcon 
          icon={<MdLogout size={20}/>} 
          title={"Logout"}
          iconStyle={iconStyle}
          borderBottom
          clickEvent={handleLogOut}
          titleStyle={titleStyle} 
          containerStyle={navIconContainerStyle}
        />
        { mediumToLargeDevices && (router.pathname == "/home/profile/[user_id]" || router.pathname == "/profile/[user_id]") && (
          <NavbarIcon 
             icon={<CgUserList size={20}/>} 
             title={""}
             iconStyle={iconStyle}
             borderBottom
             clickEvent={() => setIsShowFollows(!isShowFollows)}
             titleStyle={titleStyle} 
             containerStyle={navIconContainerStyle}
           />
        )
        }
        { mediumToLargeDevices && router.pathname == "/home" && (
          <NavbarIcon 
            icon={<GiNewspaper size={20}/>} 
            title={""}
            iconStyle={iconStyle}
            borderBottom
            clickEvent={() => setIsNews(!isNews)}
            titleStyle={titleStyle} 
            containerStyle={navIconContainerStyle}
          />
        )
        }
      </div>
      { isNews && mediumToLargeDevices && (
        <NewsOverlay />
      )
      }
      { isShowFollows && mediumToLargeDevices && (
        <FollowOverlay />
      )
      }
      { !isMenuHidden && (
        <MenuOverlay />
      )
      }
      {isTweetClicked && (
        <TweetOverlay 
          currentUser={user} 
          hideTweet={() => setIsTweetClicked(false)}
          isTweetClicked={isTweetClicked}
        />
      )
      }
    </div>
  )
}

export default Navbar