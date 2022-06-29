import { useState } from 'react';
import { urlFor } from '../../lib/client';

const Icon = ({ 
  title, 
  icon, 
  profileImg, 
  clickEvent, 
  iconStyle, 
  fullWidth,
  containerStyle,
  borderBottom,
  borderRight,
  borderLeft,
  borderTop,
  titleStyle,
   }) => {

  const [isHover, setIsHover] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
    
  return (
      <div 
        style={ containerStyle ? containerStyle : null}
        className={"icon-component-container " + ( isHover && borderBottom ? " border-bottom" 
        : isHover && borderRight ? " border-right" 
        : isHover && borderLeft ? " border-left" 
        : isHover && borderTop ? " border-top" 
        : "")}
        onMouseEnter={() => setIsHover(true)}    
        onMouseLeave={() => setIsHover(false)}
        onClick={clickEvent ? () => clickEvent() : () => setIsClicked(true) }
      >
        { icon && !profileImg && (
          <span 
            onTransitionEnd={() => setIsClicked(false)}
            style={ !isHover && iconStyle && !isClicked ? iconStyle.normal 
            : isHover && iconStyle && !isClicked ? iconStyle.hover 
            : isHover && iconStyle && isClicked ? iconStyle.active 
            : iconStyle ? iconStyle.normal : null}
            className={ !iconStyle ? ("icon-container" + (isHover && !iconStyle ? " icon-animation" : "")) : ""}>
              {icon}
          </span>
          )
        }
        { profileImg?.asset && (
            <img 
              style={{ 
                borderRadius: "50%", 
                width: "25px", 
                height: "25px" 
              }}
              className={"icon-container" 
              + (isHover ? " icon-animation" : "")}
              src={urlFor(profileImg.asset._ref)}
              alt="profile img"
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
              alt="profile img"
            />
          )
        }
        {title && (
          <span
            style={ titleStyle ? titleStyle : null}
            className={fullWidth ? "full-width" : ""}
          >
            {title}
          </span>
          )
        }
      </div>
  )
}

export default Icon