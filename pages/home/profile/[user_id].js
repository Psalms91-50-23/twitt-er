import { useState, useEffect } from 'react';
import { client } from '../../../lib/client';
import { 
  SidebarMenu, 
  ProfileWidget,  
  RoundButton } from '../../../components';
import { useStateContext } from '../../../context/StateContext';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { ImCross } from 'react-icons/im';
import { AiOutlineSearch } from 'react-icons/ai';
import { WormSpinner, Spinner } from "../../../components";
import backgroundStyles from "../../../styles/module/Background.module.scss"


const HomeProfile = ({ user, otherUsers, profile }) => {

  const supportedFormats = ['image/png', 'image/jpeg', 'image/gif', 'image/svg', 'image/tiff', 'image/webp'];
  const largeDevicesOnwards = useMediaQuery('(min-width: 900px)');
  const { 
    setTweetClicked, 
    setCurrentUserProfile,
    setUser, 
    setOtherUsers } = useStateContext();

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

  const { 
    bio, 
    firstName, 
    lastName, 
    profileBackDropURL } = userProfile;

    const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, [])
    
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

  const uploadUserImage = (e) => {
    //file size in bytes below is 20mb in byte format
    const selectedFile = e.target.files[0];
    const { type, name } = selectedFile;
    if(selectedFile?.size > 20000000){
      setFileSizeError(true);
      return;
    }
    setFileSizeError(false);
    if (
    selectedFile.type === 'image/png' 
    || selectedFile.type === 'image/svg' 
    || selectedFile.type === 'image/jpeg' 
    || selectedFile.type === 'image/gif' 
    || selectedFile.type === 'image/tiff' 
    || selectedFile.type === "image/webp" ) {
      setUserFileImage(selectedFile);
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
    if (
    selectedFile.type === 'image/png' 
    || selectedFile.type === 'image/svg' 
    || selectedFile.type === 'image/jpeg' 
    || selectedFile.type === 'image/gif' 
    || selectedFile.type === 'image/tiff'
    || selectedFile.type === "image/webp" ) {
      setUserBackdropImage(selectedFile);
    }
  };

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

  const resetLoading = () => {
    setLoading(false);
    setImageLoading(false);
    setIsEdit(!isEdit);
  }
  
  const updateDetails = async () => {
    setLoading(true);
  
    try {  
      // Update profile
      if ((userBackdropImage && !profileBackDropURL) || (userBackdropImage && profileBackDropURL)) {
        const imgAsset = await client.assets.upload('image', userBackdropImage, {
          contentType: userBackdropImage.type,
          fileName: userBackdropImage.name
        });
  
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
        };
  
        const profileResponse = await client
          .patch(profile._id)
          .set(doc)
          .commit();
  
        setProfileData(profileResponse);
        setCurrentUserProfile(profileResponse);
        resetLoading();
  
      } else if (
        (profileBackDropURL !== profile.profileBackDropURL && profileBackDropURL && !userBackdropImage) ||
        (profileBackDropURL === profile.profileBackDropURL && profileBackDropURL && !userBackdropImage)
      ) {
        const profileDoc = {
          ...userProfile,
          profileBackDropURL: profileBackDropURL !== profile.profileBackDropURL ? profileBackDropURL : profile.profileBackDropURL
        };
  
        const profileResponse = await client
          .patch(profile._id)
          .set(profileDoc)
          .commit();
  
        setProfileData(profileResponse);
        setCurrentUserProfile(profileResponse);
        resetLoading();
  
      } else {
        const doc = {
          ...userProfile,
          profileBackDropURL: "",
        };
  
        const profileResponse = await client
          .patch(profile._id)
          .set(doc)
          .commit();
  
        setProfileData(profileResponse);
        setCurrentUserProfile(profileResponse);
        resetLoading();
      }
  
  
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };
  
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

  if(!isLoaded){
    return (
      <div className={backgroundStyles.moving_clouds_behind}>
        <div className="spinner-bg-container">
          <div className="spinner-bg-content">
            <WormSpinner />
          </div>
        </div>
      </div>
    )
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
              src={profileData?.profileBackDropURL ? `${profileData.profileBackDropURL}?${new Date().getTime()}` : `/images/brick_twitter_bird.jpg`}
              alt={profileData?.profileBackDropURL ? "profile backdrop" : "default profile backdrop"}
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

    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/home/profile/${user_id}`)
    .then(res => res.json());
    const { user, otherUsers, profile } = data;
    return {
      props: { 
        user,
        otherUsers,
        profile
       },
    }
}
 
export default HomeProfile