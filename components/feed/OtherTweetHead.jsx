import { urlFor } from '../../lib/client';

const OtherTweetHead = ({ user, userProfile }) => {

  return (
    <div className="other-user-profile-container">
      <div className="other-user-images-container">
        <img
          className={"other-user-backdrop"}
          src={ userProfile?.profileBackDrop ? userProfile.profileBackDrop : "https://m.media-amazon.com/images/I/71k3M9NXBZL._AC_SY355_.jpg"} alt={ userProfile?.profileBackDrop ? "profile backdrop" : "default profile backdrop" }
        />
        <img 
          className="other-user-profile-image"
          src={ user?.profileImage ? urlFor(user.profileImage.asset._ref) : user?.imageUrl } alt="profile pic"
        />
      </div>
    </div>
  )
}

export default OtherTweetHead