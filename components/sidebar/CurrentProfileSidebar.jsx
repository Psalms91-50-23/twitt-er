import { useState } from 'react';
import { HiHashtag } from 'react-icons/hi';
import { MdNotificationsActive } from 'react-icons/md';
import { CgMenuBoxed } from 'react-icons/cg';
import { BsFillEnvelopeFill, BsBookmarkDashFill } from 'react-icons/bs';
import {  GiFeather } from 'react-icons/gi';
import { Icon } from "../";

const CurrentProfileSidebar = () => {

  return (
    <div className="current-user-sidebar-container">
        <Icon 
            icon={<HiHashtag size={!smallDevices ? 20 : 25}/>} 
            borderRight
            fullWidth
            title={ !smallDevices ? "Explore" : null }
            containerStyle={iconContainer}
            titleStyle={titleStyle}  
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
        <RoundButton 
            title={ !smallDevices ? "Tweet" : null} 
            icon={ smallDevices ? <GiFeather size={!smallDevices ? 22 : 25}/> : null}
            buttonStyle={style} 
            textColor={"rgb(255,255,255)"}
            buttonHoverColor={"rgba(29, 155, 240, 1)"}
            onClickEvent={() => setIsTweetClicked(true)}
        />
    </div>
  )
}

export default CurrentProfileSidebar