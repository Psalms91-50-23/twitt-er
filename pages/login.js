import { sanityBaseURL } from '../lib/functions';
import { queryAllUsers } from '../lib/queries';
import homeStyles from '../styles/Home.module.scss';
import backgroundStyles from '../styles/module/Background.module.scss';
import { useEffect, useState } from 'react';
import { useRouter }  from 'next/router';
import { AiFillHome } from "react-icons/ai";
import { CustomInput, TwitterBird, BirdieHands, Spinner } from '../components';
import { useStateContext } from '../context/StateContext';
import { MdLogin, MdCreate } from 'react-icons/md'
import { findUser, isPasswordMatch, isEmailMatch,  
  matchSecret, loginUser, getCurrentUserProfile } from '../lib/functions';

const Login = ({ users }) => {
  const router = useRouter();
  const { setUser, setCurrentUserProfile } = useStateContext();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmailError(false);
    setPasswordError(false)
    if(users.length){
      if(userName.includes("@")){
        const userFound = findUser(users, userName);
        if(userFound){
          setFoundUser(userFound);
        }

      }
    }
  }, [userName, users, password])
    
  async function signInUser(e){
    e.preventDefault();
    if(!foundUser) return setEmailError(true);
    if(isEmailMatch(foundUser, userName) === false) return setEmailError(true);
    if(!matchSecret(foundUser,process.env.NEXT_PUBLIC_SECRET)) return setSecretKeyError(true);
    if(!isPasswordMatch(foundUser, password)) return setPasswordError(true);
    const { _id, userName, imageUrl, profileImage } = foundUser;
    setLoading(true);
   
    if(foundUser){
      loginUser("/api/login", `${_id}${process.env.NEXT_PUBLIC_SECRET}`);
      setUser({ _id, userName, imageUrl, profileImage });
      const userProfile = await getCurrentUserProfile(_id);
      setCurrentUserProfile(userProfile)
      router.push("/home");
    }
 
}

  return (
    <div className={backgroundStyles.container_cloud_bg}>
       <div className={backgroundStyles.twitter_bird_bg}>
          <TwitterBird />
        <div className={homeStyles.home_contents}>
          <BirdieHands />
          <div className={homeStyles.home_header_title}>
            <h2>Login User</h2>
          </div>
          { loading ? (
                <Spinner 
                  message={"Loading..."} 
                  bgColor={"transparent"} 
                  outerCircle={"rgb(29 161 242"}
                  innerCircle={"rgba(255,255,255,1)"}
                />
              )
              :
            (
            <form 
              onSubmit={(e) => signInUser(e)}
              className={homeStyles.input_form_container}
              autoComplete="off"
            >
              <CustomInput 
                title={"userName"} 
                setUserName={setUserName} 
                userNameValue={userName} 
                borderColor={"rgb(29, 161, 242)"}
                titleColor={"rgb(29, 161, 242)"}
                headerText="UserName"
                textPlaceHolder={"Enter Email..."}
                // setMissingField={setMissingField}
              />
              { emailError && userName.length ? (
                  <span className={homeStyles.error_msg}>
                    No matching Email found
                  </span>
                )
                :
                null
              }
              <CustomInput 
                title={"password"} 
                setPassword={setPassword} 
                passwordValue={password}
                borderColor={"rgb(29, 161, 242)"}
                titleColor={"rgb(29, 161, 242)"}
                headerText="Password"
                textPlaceHolder={"Enter Password..."}
              />
              { passwordError && password.length  ? (
                  <span className={homeStyles.error_msg}>
                    Password mismatch!
                  </span>
                )
                :
                null
              }
              <div className={homeStyles.button_container}>
                <button 
                  className={homeStyles.btn}
                  onClick={e => signInUser(e)}
                >
                  <span className={homeStyles.icon}>
                    <MdLogin size={18}/>
                  </span>
                  Login
                </button>
                <div className={homeStyles.title_container}>
                  <h5 className={homeStyles.title}>Not Registered?</h5>
                  <h5 className={homeStyles.title_home}>Home</h5>
                </div>
                <div className={homeStyles.login_bottom_container}>
                  <button 
                    className={homeStyles.btn}
                    onClick={() => router.push("/signup")}
                  >
                    <span className={homeStyles.icon}>
                      <MdCreate size={15}/>
                    </span>
                    Signup
                  </button>
                  <button 
                    className={homeStyles.btn_home}
                    onClick={() => router.push("/")}
                  >
                    <span className={homeStyles.icon}>
                      <AiFillHome size={15}/>
                    </span>
                    Home
                  </button>    
                </div>
              </div>
            </form>
            )
          }
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ req, res }) => {

  if(req.cookies?.token){
    return {
        redirect: {
          destination: "/home",
          permanent: false
        }
    }
  }
    /*after signing up from signup route and pushing to here, the await client
    fetch ie await client.fetch(userQuery); doesn't have the latest data, unless 
     I get temp state from context but coming closing down tab and coming back
    still does give you latest data as state is deleted */
    const usersQuery = encodeURIComponent(queryAllUsers());
    const url = `${sanityBaseURL}${usersQuery}`;
    const users = await fetch(url).then(res => res.json()).catch(error => console.log(error.message));
    return {
      props: {
        users: users.result ? users.result : []
      },
    }
  }
  
export default Login