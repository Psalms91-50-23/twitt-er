
const OtherTweetHead = ({ user, profile }) => {
  return (
    <div className="other-user-profile-container">
      <div className="other-user-images-container">
        <img
          className={"other-user-backdrop"}
          src={ profile?.profileBackDropURL ? profile.profileBackDropURL 
            : "/images/brick_twitter_bird.jpg"} 
          alt={ profile?.profileBackDropURL ? "profile backdrop" : "default profile backdrop" }
        />
        <div className="other-user-contents-container">
          { user.imageUrl && (
            <img 
              className="other-user-profile-image"
              src={user?.imageUrl} alt="profile pic"
            />
          )
          }
          <div className="other-user-bio-container">
            <p className="other-user-bio">{profile.bio}</p>
          </div>
        </div>
        </div>
    </div>
  )
}

export default OtherTweetHead