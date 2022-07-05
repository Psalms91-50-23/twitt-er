import { People } from "../";

const ProfileWidget = ({ users }) => {

  return (
    <div 
      className="profile-widget-container"
    >
      <div className="profile-widget-contents">
        { users?.length ?  users.map(people => (
          <People 
            key={people._id}
            people={people}
          />
        ))
        : null
        } 
      </div>
  </div>
  )
}

export default ProfileWidget