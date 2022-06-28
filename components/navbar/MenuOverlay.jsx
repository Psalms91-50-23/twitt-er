// import { SidebarMenu } from "./"
import { HiHashtag } from 'react-icons/hi';
import { MdNotificationsActive } from 'react-icons/md';
import { CgMenuBoxed } from 'react-icons/cg';
import { BsFillEnvelopeFill, BsBookmarkFill, BsBookmarkDashFill } from 'react-icons/bs';
import { SideBarIcon, RoundButton } from "../";
import { useStateContext } from '../../context/StateContext';
import { AiOutlineLeft } from "react-icons/ai";
import { buttonStyles } from '../../styles/custom';

const MenuOverlay = () => {
    const { setIsTweetClicked, setIsMenuHidden } = useStateContext();
    const waitClick = () => {
        setTimeout(() => {
            setIsMenuHidden(true)
        }, 250);
    }
  return (
    <div className="menu-overlay-container">
        <div className="menu-overlay-contents">
            <SideBarIcon icon={<HiHashtag size={20}/>} title={"Explore"}/>
            <SideBarIcon icon={<MdNotificationsActive size={18}/>} title={"Notification"}/>
            <SideBarIcon icon={<BsFillEnvelopeFill size={18}/>} title={"Messages"}/>
            <SideBarIcon icon={<BsBookmarkDashFill size={18}/>} title={"Bookmark"}/>
            <SideBarIcon icon={<CgMenuBoxed size={20}/>} title={"Lists"}/>
            <RoundButton 
                title={"Tweet"} 
                buttonStyle={{...buttonStyles, marginTop: "10px"}} 
                textColor={"rgb(255,255,255)"}
                onClickEvent={() => setIsTweetClicked(true)}
            />        
            <span 
                className="hide-sidebar-menu"
                onClick={() => waitClick()}
            >
                <AiOutlineLeft size={30} />
            </span>
        </div>
    </div>
  )
}

export default MenuOverlay