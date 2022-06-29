import { useStateContext } from '../../context/StateContext';
import { People } from "../"

const FollowsWidget = () => {

  const { otherUsers } = useStateContext();

  return (
    <div className="follows-widget-container">
        { otherUsers.length ? otherUsers.map((otherUser, index) => (
            <People people={otherUser} key={`${otherUser._id}_${index}`}/>
        ))
        : null
        }
    </div>
  )
}

export default FollowsWidget