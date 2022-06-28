import { useStateContext } from '../../context/StateContext';
import { People } from "../"

const FollowsWidget = () => {

  const { otherUsers } = useStateContext();

  return (
    <div className="follows-widget-container">
        { otherUsers.length ? otherUsers.map(otherUser => (
            <People people={otherUser}/>
        ))
        : null
        }
    </div>
  )
}

export default FollowsWidget