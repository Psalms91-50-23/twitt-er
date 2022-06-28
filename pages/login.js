import homeStyles from '../styles/Home.module.scss';
import backgroundStyles from '../styles/module/Background.module.scss';
import { useEffect, useState } from 'react';
import cookie from 'js-cookie';
import Link from 'next/link';
import { useRouter }  from 'next/router';
import { TiArrowBack } from "react-icons/ti";
import { AiFillHome } from "react-icons/ai";
import { FcGoogle } from 'react-icons/fc';
import { CustomInput, TwitterBird, BirdieHands, LoginIcon, Spinner } from '../components';
import { useStateContext } from '../context/StateContext';
// import { Login } from '../components';
import { client } from '../lib/client';
import { MdLogin, MdCreate } from 'react-icons/md'
import { findUser, isPasswordMatch, isEmailMatch, 
    userLogin, matchSecret, loginUser, 
    getNewImageExtension, getOldImageExtension } from '../lib/functions';
import { CgLoupe } from 'react-icons/cg';
// import Router from "next/router";
const baseURL = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/development?query=`

const login = ({ users }) => {
  const router = useRouter();
  const { setUser } = useStateContext();
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
        const userFound = findUser(users, userName.toLowerCase());
        if(userFound){
          setFoundUser(userFound);
        }
      }
    }
  }, [userName, users, password])
    
  function signInUser(e){
    e.preventDefault();
    // if(!password || userName === "") return setMissingField(true);
    if(!foundUser) return setEmailError(true);
    if(isEmailMatch(foundUser, userName) === false) return setEmailError(true);
    if(!matchSecret(foundUser,process.env.NEXT_PUBLIC_SECRET)) return setSecretKeyError(true);
    if(!isPasswordMatch(foundUser, password)) return setPasswordError(true);
    const { _id, userName, imageUrl } = foundUser;
    setLoading(true);
    loginUser("/api/login", `${_id}${process.env.NEXT_PUBLIC_SECRET}`);
    if(foundUser.profileImage){
      const { profileImage } = foundUser;
      const { _ref } = profileImage.asset;
      const newExtension = getNewImageExtension(_ref);
      const originalExtension = getOldImageExtension();
      const newImage = _ref.replace('image-', `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/development/`).replace(originalExtension, newExtension);
      setUser({ _id, userName, profileImage : newImage, imageUrl });
      router.push("/home");
    }
    else{
      setUser({ _id, userName, profileImage: foundUser.profileImage ? foundUser.profileImage : "", imageUrl });
      router.push(`/home`);
  }   
}

  return (
    // <div className="container">
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

export const getServerSideProps = async (req,res) => {

  
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
    const userQuery = '*[_type == "user"]|order(_createdAt desc)';
    const url = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2022-05-10/data/query/development?query=${userQuery}`;
    const users = await fetch(url).then(res => res.json());
    return {
      props: {
        users: users.result
      },
    }
  }
  
export default login