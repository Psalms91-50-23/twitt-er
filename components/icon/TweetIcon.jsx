import { useState, useRef, createRef  } from "react";
import { Tooltip } from "../tooltip";

const TweetIcon = ({ unselectedIcon, selectedIcon, counter, isSelected, setIsSelected, iconContainer, tooltip }) => {

  const [isHover, setIsHover] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return (
    <div 
      style={ iconContainer && !isHover ? iconContainer 
        : iconContainer && isHover ? {...iconContainer, color: iconContainer.color && iconContainer.color }
        : {}}
      className="tweet-icon-container"
      onClick={() => setIsSelected(!isSelected)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="icon-wrapper">
        <span 
          className={"tweet-icon"}
          // className={ isHover && !isSelected ? "tweet-icon" : "tweet-icon-unselected"}
        >
          {unselectedIcon}
        </span>
        { counter && (
          <span 
            className="icon-counter"
          >
            {counter}
          </span>
        )
        }
      </div>
        { tooltip && isHover && (
          <Tooltip tooltip={tooltip}/>
        )
        }
    </div>
  )
}

export default TweetIcon