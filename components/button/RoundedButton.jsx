import { useState } from 'react';

const RoundedButton = ({ text, textColor, backgroundColor, buttonStyle, buttonHoverColor, onClickEvent, buttonContainerStyle, icon }) => {

  const [onHover, setOnHover] = useState(false);
  return (
    <div
      style={ buttonContainerStyle ? buttonContainerStyle : null } 
      className={"round-button-container"}
    >
      <button 
        style={ buttonStyle ? {...buttonStyle, 
          backgroundColor: onHover && buttonHoverColor ? buttonHoverColor : buttonStyle.backgroundColor,
          color: buttonStyle?.color && textColor ? buttonStyle.color : textColor
           } : { 
          backgroundColor: !onHover && backgroundColor ? backgroundColor
          : !onHover && buttonContainerStyle?.backgroundColor ?  buttonStyle.backgroundColor
          : null ,
          color: textColor && textColor
           }}
        className={"round-button"}
        onClick={onClickEvent}
        onMouseLeave={() => setOnHover(false)}
        onMouseEnter={() => setOnHover(true)}
      >
        {text ? text : icon}
      </button>
    </div>
  )
}

export default RoundedButton