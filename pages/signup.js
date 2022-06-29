import backgroundStyles from '../styles/module/Background.module.scss';
import homeStyles from '../styles/Home.module.scss';
import signupStyles from '../styles/module/signup.module.scss';
import { useState, useEffect } from 'react';
import {useRef} from 'react';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { client } from "../lib/client";
import { TiArrowBack } from "react-icons/ti";
import { AiFillHome } from "react-icons/ai";
import { useRouter }  from 'next/router';
import { CustomInput, TwitterBird, BirdieHands, Spinner }  from '../components';
import { MdLogin, MdCreate } from 'react-icons/md'
import { findUser, encodePassword, getEncodedPattern,
        decodePassword, validateEmail } from '../lib/functions';
import { useStateContext } from '../context/StateContext';
import { MdComputer } from "react-icons/md";
import { GiSpiderWeb } from "react-icons/gi";


const Signup = ({ users }) => {

  const router = useRouter();
  const {  addNewUser, setAllUsers } = useStateContext();
  // const [allUsers, setAllUsers] = useState(user)
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [missingUsername, setMissingUsername] = useState(false);
  const [missingPassword, setMissingPassword] = useState(false);
  const [userExistsError, setUserExistsError] = useState(false);
  const [fileInput, setFileInput] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [imageString, setImageString] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const inputRef = useRef(null);
  // const [missingField, setMissingField] = useState(true)
  const [latestUpdatedUsers, setLatestUpdatedUsers] = useState([]);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isUpload, setIsUpload] = useState(false);
  const [missingField, setMissingField] = useState(false);

  useEffect(() => {  
    setAllUsers(users);
  }, [users])
  
  useEffect(() => {
    setUserExistsError(false);
    setEmailError(false);
    setMissingUsername(false);
    setMissingPassword(false);
    if(validateEmail(userName)){
      const userFound = findUser(users,userName);
      if(userFound){
        setUserExistsError(true);
      }
    }
  },[userName, password])

  useEffect(() => {
    setMissingField(false);
  }, [imageUrl])
  
  const resetFileInput = () => {
    // 👇️ reset input value
    console.log({inputRef});
    inputRef.current.value = "";
  };

  const uploadImage = (e) => {
    //file size in bytes below is 20mb in byte format
    const selectedFile = e.target.files[0];
    const { type, name } = selectedFile;
    if(selectedFile?.size > 20000000){
      setFileSizeError(true);
      return;
    }
    setFileSizeError(false);
    // const { type, name } = selectedFile;
    if (selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff') {
      setWrongImageType(false);
      setProfileImage(selectedFile);
      console.log("profile image ",profileImage);
    } else {
      setLoading(false);
      setWrongImageType(true);
    }
  };
  
  const handleSubmitUser = (e) => {
    e.preventDefault();
    if(fileSizeError) return;
    if(!userName) return setMissingUsername(true);
    if(!validateEmail(userName)) return setEmailError(true);  
    if(!password) return setMissingPassword(true);
      const passwordEncoded = encodePassword(password);
      const passwordEncodedPattern = JSON.stringify(getEncodedPattern());
      let doc = {
        _id: uuidv4(),
        _type: 'user',
        userName,
        password: passwordEncoded,
        passwordEncodedPattern,
        imageUrl,
        _createdAt: new Date().toISOString()
      }
    if(profileImage && userName && password && !imageUrl){

      setLoading(true);
      const { name, type } = profileImage;
      client.assets
      .upload('image', profileImage, { contentType: type, filename: name })
      .then((imgAsset) => {
        return client
        .patch(imgAsset._id)
        .set({
          profileImage: {
            _type: 'image',
            asset: {
              _type: "reference",
              _ref: imgAsset._id
            }
          }
        })
        .commit();
      })
      .then((response) => {
        doc = {
          ...doc,
          profileImage: {
            _type: 'image',
            asset: {
              _type: "reference",
              _ref: response._id
            }
          }
        };
        const passwordDecoded = decodePassword(JSON.parse(passwordEncodedPattern), passwordEncoded);
        client.createIfNotExists(doc).then((newUser) => {
          addNewUser(newUser);
          const profileDoc = {
            _type: "profile",
            _id: uuidv4(),
            firstName: "",
            lastName: "",
            profileBackDrop: "",
            bio: "",
            userId : {
              _type: "reference",
              _ref: newUser._id
            },
            _createdAt: new Date().toISOString(),
          }
          
          client.createIfNotExists(profileDoc)
          .then(res => {
            // res
            router.push("/login");
          })
        });
      })
      .catch((error) => {
        console.log('Upload failed:', error.message);
      });
    }
    else{

      if(!imageUrl){
        setMissingField(true);
        return
      }
      setLoading(true);
      client.createIfNotExists(doc)
      .then((newUser) => {
        addNewUser(newUser);
        const profileDoc = {
          _type: "profile",
          _id: uuidv4(),
          firstName: "",
          lastName: "",
          profileBackDrop: "",
          bio: "",
          userId : {
            _type: "reference",
            _ref: newUser._id
          },
          _createdAt: new Date().toISOString(),
        }
        client.createIfNotExists(profileDoc)
        .then(res => {
          router.push("/login");
        })
        // router.push("/login");
      })
      .catch((error) => {
        console.log('Upload failed:', error.message);
      });
    }
  }
  
  const toggleIsFileInput = () => {
    setFileInput(!fileInput);
  }

  console.log({fileSizeError});
  console.log(profileImage)
  return (
    // <div className="container">
    <div className={backgroundStyles.container_cloud_bg}>
        <div className={backgroundStyles.twitter_bird_bg}>
        <TwitterBird />
        <div className={signupStyles.create_user_contents}>
          {/* <div className={homeStyles.home_contents}> */}
            <BirdieHands />
            <div className={homeStyles.home_header_title}>
              <h2>Sign-Up User</h2>
            </div>
            {
              loading ? (
                  <Spinner 
                    message={"Loading..."} 
                    bgColor={"transparent"} 
                    outerCircle={"rgb(29 161 242"}
                    innerCircle={"#ffffff"}
                  />
                )
                :
              <>
              <form 
                onSubmit={e => handleSubmitUser(e)}
                className={signupStyles.input_form_container}
                autoComplete="off"
                // className={"input-form-container" + (loading ? " spinner-bg" : "")}
                // autoComplete="off"
                // className={"create-user-inputs-container" + (loading ? " spinner-bg" : "")
              >
                <CustomInput 
                  title={"userName"} 
                  setUserName={setUserName} 
                  userNameValue={userName} 
                  borderColor={"rgb(29, 161, 242)"}
                  titleColor={"rgb(29, 161, 242)"}
                  headerText="UserName"
                  textPlaceHolder={"test123@ex-ample.com"}
                  // setMissingField={setMissingField}
                  // inputBorderWidth={1}
                  // borderStyles
                  // inputStyles={inputStyles}
                  // titleFontWeight={"700"}
                  // inputBgColor={"rgba(0, 128, 0, 0.501)"}
                />
                { emailError && (
                  <span className={homeStyles.error_msg}>
                    Email is Not correct Format eg testing@gmail.com / testing@hotmail.co.uk
                  </span>
                )
                }
                { userExistsError && (
                  <span className={homeStyles.error_msg}>
                    User email already exists, please create another.
                  </span>
                )
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
                { missingPassword && (
                  <span className={homeStyles.error_msg}>
                    Password field missing
                  </span>
                )
                }
                {fileInput ? (
                  <CustomInput 
                    fileInput 
                    headerText={"Upload Image from Computer"} 
                    titleColor={"rgb(29, 161, 242)"}
                    uploadImage={uploadImage}
                  />
                )
                : null
                }
                { fileSizeError && (
                  <span className={homeStyles.error_msg}>
                    File size over 20Mb
                  </span>
                )
                }
                {!fileInput ? (
                  <CustomInput 
                    title={"url"} 
                    setImageUrl={setImageUrl} 
                    imageUrlValue={imageUrl}  
                    borderColor={"rgb(29, 161, 242)"}
                    titleColor={"rgb(29, 161, 242)"}
                    headerText="User Profile Image Url"
                    textPlaceHolder={"Image Url..."}
                    // setMissingField={setMissingField}
                  />
                )
                :
                null
                }
                { missingField && (
                  <span className={homeStyles.error_msg}>Missing profile image URL or profile computer image</span>
                )
                }
                {emailError && (
                  <span className={homeStyles.error_msg}>Not a valid Email pattern</span>
                )
                }
                <div className={homeStyles.button_container}>
                  <button 
                    className={homeStyles.btn}
                    onClick={toggleIsFileInput}
                    >
                      <span className={homeStyles.icon}>
                        { fileInput ? <GiSpiderWeb size={22}/>
                          : <MdComputer size={22}/>
                        }
                      </span>
                      <span >
                        Upload image from { fileInput ? "URL" : "Computer" }
                      </span>
                  </button>
                  <button 
                    className={homeStyles.btn}
                    onClick={e => handleSubmitUser(e)}
                  >
                    <span className={homeStyles.icon}>
                      <MdCreate size={15}/>
                    </span>
                    Signup
                  </button>
                  <div className={homeStyles.title_container}>
                    <h5 className={homeStyles.title}>Registered?</h5>
                    <h5 className={homeStyles.title_home}>Home</h5>
                  </div>
                  <div className={homeStyles.login_bottom_container}>
                    <button 
                      className={homeStyles.btn}
                      onClick={() => router.push("/login")}
                    >
                      <span className={homeStyles.icon}>
                        <MdLogin size={18}/>
                      </span>
                      Login
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
            </> 
            }
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({req,res}) => {

  if(req.cookies?.token){
    return {
        redirect: {
          destination: "/home",
          permanent: false
        }
    }
  }

  const userQuery = `*[_type == "user"]`

  const url = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2022-05-10/data/query/development?query=${userQuery}`;
  const users = await fetch(url).then(res => res.json());
  return {
    props: {
      users: users.result
    }
  }
}

export default Signup