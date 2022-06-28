import { useState } from 'react';
import { urlFor } from '../../lib/client';

const NavbarIcon = ({ 
  title, 
  icon, 
  profileImg, 
  clickEvent, 
  iconStyle, 
  fullWidth,
  containerStyle,
  borderBottom,
  titleStyle,
  borderColor
   }) => {

  const [isHover, setIsHover] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
    
  return (
    <div 
      style={ containerStyle ? containerStyle : null}
      className={"navbar-icon-container" }
      onMouseEnter={() => setIsHover(true)}    
      onMouseLeave={() => setIsHover(false)}
      onClick={clickEvent && (() => clickEvent()) }
    >
      { icon && !profileImg && (
        <span 
          onTransitionEnd={() => setIsClicked(false)}
          style={iconStyle}
          className={ iconStyle ? "nav-icon" : "nav-icon-default" }
        >
          {icon}
        </span>
        )
      }
      { profileImg?.asset && (
          <img 
            style={{ 
              borderRadius: "50%", 
              width: "22px", 
              height: "22px" 
            }}
            className={"icon-container" 
            + (isHover ? " icon-animation" : "")}
            src={urlFor(profileImg.asset._ref)}
          />
      )
      }
      { profileImg && !profileImg.asset &&
        (
          <img 
            style={{ 
            borderRadius: "50%", 
            width: "25px", 
            height: "25px" }}
            className={"icon-container" 
            + (isHover ? " icon-animation" : "")}
            src={profileImg}
          />
        )
      }
      {title && (
        <span
          style={ titleStyle ? titleStyle : null}
          className={fullWidth ? "full-width" : "nav-title"}
        >
          {title}
        </span>
        )
      }
      {
        borderBottom && (
          <div 
            style={ borderColor && borderColor }
            className={ borderColor ? "nav-border-bot" : "nav-border-bot-default"}></div>
        )
      }
    </div>
  )
}

export default NavbarIcon