import { HiHashtag } from 'react-icons/hi';
import { MdNotificationsActive } from 'react-icons/md';
import { CgMenuBoxed } from 'react-icons/cg';
import { BsFillEnvelopeFill, BsBookmarkDashFill } from 'react-icons/bs';
import {  GiFeather } from 'react-icons/gi';
import { RoundButton, Icon } from "../";
import { useStateContext } from '../../context/StateContext';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useRouter } from 'next/router';

const SidebarMenu = ({ sidebarContainerStyle }) => {

  const smallDevices = useMediaQuery('(max-width: 660px)');
  const { setIsTweetClicked } = useStateContext();
  const router = useRouter();
  const style = {
    borderRadius: "50%"
  }

  const buttonStyle = {
    backgroundColor: "rgba(29, 155, 240, 0.5)" ,
    border: "none",
    padding: "10px",
    color: "rgb(255,255,255)",
    fontWeight: "700",
    marginTop: "10px",
    width: smallDevices ? "50px" : "100%",
    height: smallDevices ? "50px" : "auto",
    borderRadius: smallDevices ?  "50%" : "30px"
  }


  const iconContainer = {
    marginTop: !smallDevices ? "10px" : "20px",
    marginBottom: !smallDevices ? "10px" : "20px",
  }

  // const iconStyle = {
  //   color: "rgba(255,255,255,1)"
  // }

  const titleStyle = {
    fontWeight: "700",
    color: "rgba(255,255,255,1)"
  }

  return (
    <div 
      style={ sidebarContainerStyle && sidebarContainerStyle }
      className="sidebar-menu-container"
    >
      <Icon 
        icon={<HiHashtag size={!smallDevices ? 20 : 25}/>} 
        borderRight
        fullWidth
        title={ !smallDevices ? "Explore" : null }
        containerStyle={iconContainer}
        titleStyle={titleStyle}  
        // iconStyle={iconStyle}
      />
      <Icon 
        icon={<MdNotificationsActive size={!smallDevices ? 18 : 22}/>} 
        borderRight 
        fullWidth 
        title={ !smallDevices ? "Notification" : null }
        containerStyle={iconContainer}
        titleStyle={titleStyle}
        />
      <Icon 
        icon={<BsFillEnvelopeFill size={!smallDevices ? 18 : 22}/>} 
        borderRight
        fullWidth
        title={ !smallDevices ? "Messages" : null }
        containerStyle={iconContainer}
        titleStyle={titleStyle}
        />
      <Icon 
        icon={<BsBookmarkDashFill size={!smallDevices ? 18 : 22}/>} 
        borderRight
        fullWidth
        title={ !smallDevices ? "Bookmark" : null }
        containerStyle={iconContainer}
        titleStyle={titleStyle}
        />
      <Icon 
        icon={<CgMenuBoxed size={!smallDevices ? 20 : 25}/>} 
        borderRight
        fullWidth
        title={ !smallDevices ? "Lists" : null }
        containerStyle={iconContainer}
        titleStyle={titleStyle}
        />
      { router.route == "/home" && (
        <RoundButton 
          text={ !smallDevices ? "Tweet" : null} 
          icon={ smallDevices ? <GiFeather size={!smallDevices ? 22 : 25}/> : null}
          buttonContainerStyle={ smallDevices &&  style }
          buttonStyle={buttonStyle } 
          textColor={"rgb(255,255,255)"}
          buttonHoverColor={"rgba(29, 155, 240, 1)"}
          onClickEvent={() => setIsTweetClicked(true)}
        />
      )
      }
    </div>
  )
}

export default SidebarMenu