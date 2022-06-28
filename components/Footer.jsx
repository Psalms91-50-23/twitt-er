import { AiOutlineLinkedin, AiOutlineTwitter, AiFillFacebook, AiFillInstagram } from "react-icons/ai";
import { FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer-container">
      <h5 className="footer-title">All Rights are reserved Copyright Under Twitt-Er @2022</h5>
      <div className="footer-icons-container">
          <AiFillFacebook size={20}/>
          <AiOutlineTwitter size={20}/>
          <AiOutlineLinkedin size={20}/> 
          <AiFillInstagram size={20}/>
          <FaTiktok size={15}/>
      </div>
    </div>
  )
}

export default Footer