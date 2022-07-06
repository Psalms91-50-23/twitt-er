import { useState, useEffect } from "react";
import { Tooltip } from "../tooltip";

const TweetIcon = ({ 
  unselectedIcon, 
  selectedIcon, 
  counter, 
  isSelected, 
  setIsSelected, 
  iconContainer, 
  tooltip }) => {

  
  const [isHover, setIsHover] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, [])
  

  return (
    <>
    { isLoaded && (
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
          { unselectedIcon && (
            <span 
              className={"tweet-icon"}
            >
              {unselectedIcon}
            </span>
          )
          }
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
    </>
  )
}

export default TweetIcon