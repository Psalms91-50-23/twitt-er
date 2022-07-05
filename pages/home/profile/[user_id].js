import axios from 'axios';
import { useState, useEffect } from 'react';
import { client, urlFor } from '../../../lib/client';
import { updateProfile, updateUser, sanityBaseURL } from '../../../lib/functions';
import { queryUser, queryProfile } from '../../../lib/queries';
import { 
  SidebarMenu, 
  ProfileWidget,  
  RoundButton } from '../../../components';
import { useStateContext } from '../../../context/StateContext';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { ImCross } from 'react-icons/im';
import { AiOutlineSearch } from 'react-icons/ai';
import { WormSpinner, Spinner } from "../../../components";

const HomeProfile = ({ user, otherUsers, profile }) => {
  // console.log({user});
  const largeDevicesOnwards = useMediaQuery('(min-width: 900px)');
  const { 
    setTweetClicked, 
    setCurrentUserProfile,
    setUser, 
    setOtherUsers, 
    setIsLoading } = useStateContext();

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [profileData, setProfileData] = useState(profile); //end profile data after onchange
  const [userProfile, setUserProfile] = useState(profile);
  //file images
  const [userFileImage, setUserFileImage] = useState("");
  const [userBackdropImage, setUserBackdropImage] = useState("")

  const [thisUser, setThisUser] = useState(user);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [name, setName] = useState("");
  // const [imageUrl, setImageUrl] = useState("");
  const [isImageUrl, setIsImageUrl] = useState(false);
  const [isImageUrlBackdrop, setIsImageUrlBackdrop] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [profileTemp, setProfileTemp] = useState({
    bio: "",
    firstName: "",
    lastName: "",
    profileBackDropUrl: ""
  })

  const { imageUrl } = thisUser;
  // console.log("profile ",profile);

  const { 
    bio, 
    firstName, 
    lastName, 
    profileBackDropURL } = userProfile;

  // const { 
  //   bio, 
  //   firstName, 
  //   lastName, 
  //   profileBackDropURL } = profileTemp;

  useEffect(() => {
    setCurrentUserProfile(profile);
    setOtherUsers(otherUsers);
    setUser(user);
  }, [otherUsers, user, setUser, profile,
    setCurrentUserProfile, setOtherUsers])

  useEffect(() => {
    if(name){
      const usersFiltered = otherUsers.filter(user => user.userName.includes(name));
      setFilteredUsers(usersFiltered)
    }else {
      setFilteredUsers([])
    }
  }, [name,otherUsers, setFilteredUsers])
  
  
  // useEffect(() => {

  //     if(isUpdated){
  //       console.log("top");
  //       if(imageUrl || userFileImage){
  //         console.log("inside imgurl and userfile");
  //         const fetchLastUserUpdates = async () => {
  //           console.log("async 1");
  //           const userQuery = encodeURIComponent(queryUser(user._id));
  //           // const userData = await 
  //           client.fetch(`${sanityBaseURL}${userQuery}`)
  //             .then(res => res.json())
  //             .then(res => {
  //               console.log("here in useEffect ",res);
  //               setThisUser(res.result);
  //               if(imageUrl){
  //                 setImageUrl("");
  //               }else {
  //                 setUserFileImage("");
  //               }
  //               // setLoading(false);
  //             })
  //             .catch(error => console.log(error.message));
  //             // return userData;
  //           } 
  //         fetchLastUserUpdates();
  //       }
  //       console.log("profile backdrop url || image");
  //       if(profileBackDropURL || userBackdropImage){
  //         console.log("inside url back and image");
  //           const fetchLastProfileUpdates = async () => {
  //             console.log("async ");
  //               const profileQuery = encodeURIComponent(queryProfile(user._id));
  //               // const profileData = await 
  //               fetch(`${sanityBaseURL}${profileQuery}`)
  //               .then(res => res.json())
  //               .then(res => {
  //                 console.log("here profile update ",res);
  //                 if(profileBackDropURL){
  //                   setUserProfile((profileData) => ({...profileData, profileBackDropURL : ""}))
  //                 }else {
  //                   setUserBackdropImage("");
  //                 }
  //               })
  //               .catch(error => console.log(error.message));
  //               // return profileData;
  //           }

  //           fetchLastProfileUpdates();
  //         }
  //         setIsUpdated(false);
  //         setLoading(false);
  //         setIsEdit(false);
  //       }
  // }, [setThisUser, loading, setLoading, user, isUpdated, setIsUpdated])

  console.log({isUpdated});
  const uploadUserImage = (e) => {
    //file size in bytes below is 20mb in byte format
    const selectedFile = e.target.files[0];
    console.log({selectedFile});
    const { type, name } = selectedFile;
    if(selectedFile?.size > 20000000){
      setFileSizeError(true);
      return;
    }
    console.log("1");
    setFileSizeError(false);
    // const { type, name } = selectedFile;
    if (selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/jpeg' 
    || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff' || selectedFile.type === "image/webp") {
      setUserFileImage(selectedFile);
      console.log("2");
    }

  };

  const uploadBackdropImage = (e) => {
    //file size in bytes below is 20mb in byte format
    const selectedFile = e.target.files[0];
    const { type, name } = selectedFile;
    if(selectedFile?.size > 20000000){
      setFileSizeError(true);
      return;
    }
    setFileSizeError(false);
    // const { type, name } = selectedFile;
    if (selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/jpeg' 
    || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff') {
      // setUserFileImage(selectedFile);
      setUserBackdropImage(selectedFile);
    }
  };

  // console.log("user file image ",userFileImage);
  // console.log("user profile img backdrop ",userBackdropImage);

  const onChangeProfile = (e) => {
    if(e.target.name == "profileBackDropURL"){
      setImageLoading(true);
      setUserProfile(profileDeets => ({...profileDeets, [e.target.name] : e.target.value}))
      if(e.target.value == profile.profileBackDrop){
        setImageLoading(false);
      }
    } else{
      setUserProfile(profileDeets => ({...profileDeets, [e.target.name] : e.target.value}))
    }
  }

  const updateUserImage = () => {

    if(userFileImage && !imageUrl){

      client.assets
      .upload('image', userFileImage, { contentType: userFileImage.type, fileName: userFileImage.name})
      .then(imgAsset => {

        const uploadImgDoc = {
          ...thisUser,
          profileImage: {
            _type: 'image',
            asset: {
              _type: "reference",
              _ref: response._id
            }
          },
          imageUrl: response.url
        }
        //updating user table  
        client.patch(thisUser._id)
        .set(uploadImgDoc)
        .commit()
        .then(updatedUserRes => {
          setThisUser(updatedUserRes)
          setUser(updatedUserRes)

          // const doc = {
          //   ...userProfile,
          //   profileBackDrop: profileBackDrop !== profile.profileBackDrop ? profileBackDrop : profile.profileBackDrop
          // }
        })

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
        .commit()
      })
      .then(response => {
        const uploadImgDoc = {
          ...thisUser,
          profileImage: {
            _type: 'image',
            asset: {
              _type: "reference",
              _ref: response._id
            }
          },
          imageUrl: response.url
        }
        //updating user table  
        client.patch(thisUser._id)
        .set(uploadImgDoc)
        .commit()
        .then(updatedUserRes => {
          setThisUser(updatedUserRes)
          setUser(updatedUserRes)
        })
    })
    }
    else if(imageUrl){

      const uploadImgDoc = {
        ...thisUser,
        profileImage: {
          _type: 'image',
          asset: {
            _type: "reference",
            _ref: response._id
          }
        },
        imageUrl: response.url
      }
      //updating user table  
      client.patch(thisUser._id)
      .set(uploadImgDoc)
      .commit()
      .then(updatedUserRes => {
        setThisUser(updatedUserRes)
        setUser(updatedUserRes)

        // const doc = {
        //   ...userProfile,
        //   profileBackDrop: profileBackDrop !== profile.profileBackDrop ? profileBackDrop : profile.profileBackDrop
        // }
      })
    }

  }
  
  const updateDetails = async () => {
    setLoading(true);
    const updateProfile = () => {
      //update profile second
      if((userBackdropImage && !profileBackDropURL) || (userBackdropImage && profileBackDropURL)){
          client.assets
          .upload('image', userBackdropImage, { contentType: userBackdropImage.type, fileName: userBackdropImage.name})
          .then(imgAsset => {
            const { url, size, path, originalFilename, assetId, _id } = imgAsset;
            const doc = {
              ...userProfile,
              profileBackDropURL: url,
              profileImageBackdrop: {
                _type: "image",
                asset: {
                  _ref: _id,
                  _type: "reference"
                },
                originalFilename,
                path,
                size,
                assetId,
              }
            }
            client.patch(profile._id)
            .set(doc)
            .commit()
            .then(profileResponse => {
              setProfileData(profileResponse);
              setCurrentUserProfile(profileResponse);
            })
            .then(() => {
              setLoading(false);
              setImageLoading(false);
              setIsEdit(!isEdit);
            })
            .catch(error => console.log(error.message));
          })
        }
        else if((profileBackDropURL !== profile.profileBackDropURL && profileBackDropURL && !userBackdropImage)
        || (profileBackDropURL === profile.profileBackDropURL && profileBackDropURL && !userBackdropImage)){
          const profileDoc = {
            ...userProfile,
            profileBackDropURL: profileBackDropURL !== profile.profileBackDropURL ? profileBackDropURL 
            : profile.profileBackDropURL
          }
          client.patch(profile._id)
          .set(profileDoc)
          .commit()
          .then(profileResponse => {
            setProfileData(profileResponse);
            setCurrentUserProfile(profileResponse);
        })
        .then(() => {
          setLoading(false);
          setIsEdit(!isEdit);
          setImageLoading(false);
        })
        .catch(error => console.log(error.message));
      }
    }
      //do user table update first
      const updateUser = (callBack) => {
        if((userFileImage && !imageUrl) || (userFileImage && imageUrl)){
          client.assets
          .upload('image', userFileImage, { contentType: userFileImage.type, fileName: userFileImage.name})
          .then(imgAsset => {
            const { url, size, path, originalFilename, assetId, _id } = imgAsset;
            const uploadImgDoc = {
              ...thisUser,
              profileImage: {
                _type: "image",
                asset: {
                  _ref: _id,
                  _type: "reference"
                },
                originalFilename,
                path,
                size,
                assetId,
              },
              imageUrl: url
            }
            //updating user table  
            client.patch(thisUser._id)
            .set(uploadImgDoc)
            .commit()
            .then(userResponse => {
              setThisUser(userResponse);
              setUser(userResponse);
            })
          })
          .then(() => {
            callBack();
          })
          .catch(error => console.log(error.message));
    
        } else if(imageUrl !== user.imageUrl && imageUrl && !userFileImage){
          const uploadImgDoc = {
            ...thisUser,
            imageUrl
          }
           //updating user table  
           client.patch(thisUser._id)
           .set(uploadImgDoc)
           .commit()
           .then(userResponse => {
             setThisUser(userResponse);
             setUser(userResponse);
           })
          .then(() => {
            callBack();
          })
          .catch(error => console.log(error.message));
        } else {
          callBack();
        }
      }
      updateUser(updateProfile); 
  }
  
  const toggleBackDropImage = () => {
    if(isImageUrlBackdrop){
      setProfileTemp(profileData => ({...profileData, profileBackDropURL: ""}))
      setIsImageUrlBackdrop(!isImageUrlBackdrop)
    }else {
      setUserBackdropImage("");
      setIsImageUrlBackdrop(!isImageUrlBackdrop)
    }
  }

  const toggleUserImage = () => {
    if(isImageUrl){
      // setThisUser(userDeets => ({...userDeets, imageUrl: ""}));
      setIsImageUrl(!isImageUrl);
    } else {
      setUserFileImage("");
      setIsImageUrl(!isImageUrl);
    }
  }

  const buttonStyles = {
    fontWeight: 700,
    color: "rgba(255,255,255,1)",
    backgroundColor: "rgba(29,155,240,0.5)",
    paddingRight: "10px",
    width: "100%"
  }

  return (
    <div className="current-user-main-container">
      <div className="current-user-sidebar-container">
        <SidebarMenu 
          userDetails={thisUser} 
          setTweetClicked={setTweetClicked}
        />
      </div>
      <div className="current-user-container">
        { loading ? (
          <div className="spinner-bg-container">
            <div className="spinner-bg-content">
              <WormSpinner />
            </div>
          </div>
        )
        : (
        <div className="current-user-picture-container">
          <div className="current-user-images-container">          
            { imageLoading && (
              <div className="spinner-image">
                <Spinner 
                  message={"Loading..."} 
                  bgColor={"transparent"} 
                  outerCircle={"rgb(29 161 242"}
                  innerCircle={"rgba(255,255,255,1)"}
                />
              </div>
              )
            }
            { !imageLoading && (
              <img
                className={"current-user-backdrop"}
                src={ profileData?.profileBackDropURL ? profileData.profileBackDropURL 
                : `/images/brick_twitter_bird.jpg`} 
                alt={ profileData?.profileBackDropURL ? "profile backdrop" : "default profile backdrop" }
              />
            )
            }
            <img 
              className="current-user-profile-image"
              src={ thisUser?.imageUrl && thisUser?.imageUrl } 
              alt="profile pic"
            />
            <div className="current-user-edit-button">
              <RoundButton 
                buttonStyle={buttonStyles}
                text={!isEdit && "Edit Profile"}
                icon={<ImCross size={18}/>}
                buttonHoverColor={"rgba(29,155,240,1)"}
                onClickEvent={() => setIsEdit(!isEdit)}
              />
            </div>
          </div>
          <div className="profile-info-container">
            { isEdit && (
              <div className={"edit-profile-container sliding-down"}>
                <div className="name-input-container">
                  <span className="name-text">First Name: </span>
                  <input 
                    autoComplete="off"
                    name="firstName"
                    value={firstName}
                    className="first-name-input"
                    onChange={e => onChangeProfile(e)}
                    placeholder="First name here..."
                  />
                </div>
                <div className="name-input-container">
                  <span className="name-text">Last Name: </span>
                  <input 
                    autoComplete="off"
                    name="lastName"
                    className="last-name-input"
                    value={lastName}
                    onChange={e => onChangeProfile(e)}
                    placeholder="Last name here..."
                  />
                </div>
                {/* <div className="profile-image-container">
                  <span className="name-text">Profile Image: </span>
                  <input 
                    type={"file"}
                    name="profileImageBackdrop"
                    className="image-input-comp"
                    // value={lastName}
                    onChange={e => uploadImage(e)}
                  />
                </div> */}
                <div className="backdrop-imageurl-container">
                  <span className="profile-image-text">Profile Image: </span>
                  <div className="profile-user-image-container">
                    { isImageUrl && (
                      <input 
                        autoComplete="off"
                        type={"text"}
                        name="imageUrl"
                        value={imageUrl}
                        className="image-input-url"
                        placeholder="Image URL here..."
                        onChange={e => setThisUser(userDeets =>({...userDeets, [e.target.name]:e.target.value}))}
                        // onChange={e => setImageUrl(e.target.value)}
                      />)
                    }
                    { !isImageUrl && (
                      <input 
                        type={"file"}
                        name="profileImage"
                        className="image-input-comp"
                        onChange={e => uploadUserImage(e)}
                      />)
                    }
                    <button 
                      className="toggle-profile-type"
                      onClick={() => toggleUserImage()}
                    >
                      {isImageUrl ? "File?" : "URL?"}
                    </button> 
                  </div>
                </div>
                <div className="profile-contents-container">
                  <span className="backdrop-text">Backdrop Image: </span>
                  <div className="profile-backdrop-container">
                  { isImageUrlBackdrop && (
                      <input 
                        autoComplete="off"
                        name="profileBackDropURL"
                        value={profileBackDropURL}
                        className="background-image-input"
                        onChange={e => onChangeProfile(e)}
                        placeholder="Url of image here..."
                      />
                    )
                  }
                  { !isImageUrlBackdrop && 
                    (
                      <input 
                        type={"file"}
                        name="profileImageBackdrop"
                        className="image-input-comp"
                        onChange={e => uploadBackdropImage(e)}
                      />
                    )
                  }
                    <button 
                      className="toggle-profile-type"
                      onClick={() => toggleBackDropImage()}
                    >
                      { isImageUrlBackdrop ? "File?" : "URL?" }
                    </button> 
                  </div>
                </div>
                <div className="bio-input-container">
                  <span className="name-text">Bio: </span>
                  <textarea 
                    name="bio"
                    className="bio-input"
                    rows="auto"
                    value={bio}
                    resize={"none"}
                    onChange={e => onChangeProfile(e)}
                    placeholder="Enter your life story..."
                  />
                </div>
                <div className="submit-edit-container">
                  <RoundButton 
                      buttonStyle={buttonStyles}
                      onClickEvent={() => updateDetails()}
                      text={"Submit"}
                      icon={<ImCross size={18}/>}
                      buttonHoverColor={"rgba(29,155,240,1)"}
                  />
                </div>
              </div>
            )
            }
            <div className="details-container">
              <p>
                First Name: {profileData?.firstName}
              </p>
              <p>
                Last Name: {profileData?.lastName}
              </p>
              <p>
                Bio: {profileData?.bio}
              </p>
            </div>
          </div>
        </div>
        )
        }
        { largeDevicesOnwards && (
          <div className="current-user-widget-container">
            <div className="search-people-container">
              <input 
                autoComplete="off"
                className="search-input"
                type="text" 
                name="name"
                onChange={(e) => setName(e.target.value)}
              />
              <span className="search-icon">
                <AiOutlineSearch size={25}/>
              </span>
            </div>
            <ProfileWidget users={ filteredUsers?.length ? filteredUsers : otherUsers }/>
          </div>
        )
        }
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ params: { user_id }}) => {

    const data = await fetch(`${process.env.NEXT_BASE_URL}/api/home/profile/${user_id}`)
    .then(res => res.json());
    const { user, otherUsers, profile } = data;
    // console.log({data});
    return {
      props: { 
        user,
        otherUsers,
        profile
       },
    }
}

export default HomeProfile