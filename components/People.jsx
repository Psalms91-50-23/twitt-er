import { RoundButton } from './';
import { useRouter } from 'next/router';
import { useStateContext } from '../context/StateContext';

const People = ({ people }) => {

  const router = useRouter();
  const { setIsShowFollows, isShowFollows } = useStateContext();

  const redirect = () => {
    router.push(`/profile/${people?._id}`);
    setTimeout(() => {
      setIsShowFollows(false);
    }, 500);
  }

  return (
    <div className="people-container">
      <div className="people-contents-container">
        <div className="people-image-container">
          { people.imageUrl && (
            <img
              className="people-image" 
              src={people.imageUrl} 
              alt="profile image"
              onClick={() => redirect()}
            />
          )
          }
          <span className="people-username">@{people.userName.split(/[@.]/)[0]}</span>
        </div>
        <RoundButton 
          text={"Follow"}
          textColor={"rgba(255,255,255,1)"}
        />
      </div>
    </div>
  )
}

export default People