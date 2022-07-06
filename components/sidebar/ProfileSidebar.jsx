import { WormSpinner } from "../";

const ProfileSidebar = ({ user, profile }) => {

  return (
      <div className="sidebar-top">
        <div 
          style={profile?.profileBackDropURL ? { backgroundImage: `url(${profile.profileBackDropURL})`, backgroundSize: 'cover'} : null}
          className="profile-details-container"
        >
          <div 
            className={"home-image-container"}>
            { user?.imageUrl && (
                <img 
                  className="home-profile-image"
                  src={user?.imageUrl && user.imageUrl}
                  alt="profile img"
                />
            )
          }
          { !user.imageUrl && (
            <div className="home-profile-image">
              <WormSpinner />
            </div>
          )
          }
          </div>
        </div>
      </div>
  )
}

export default ProfileSidebar