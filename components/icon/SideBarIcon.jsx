import { useState } from 'react';

const SidebarIcon = ({ title, icon, clickEvent }) => {

  const [isHover, setIsHover] = useState(false);
  return (
    <div 
        className={"sidebar-icon-container"}
        onMouseEnter={() => setIsHover(true)}    
        onMouseLeave={() => setIsHover(false)}
        onClick={clickEvent && clickEvent }
    >
      { icon && (
        <span 
          className={"sidebar-icon" + (isHover ? " sidebar-icon-animation" : "")}>
            {icon}
        </span>
        )
      }
      <span className="sidebar-title">{title}</span>
    </div>
  )
}

export default SidebarIcon