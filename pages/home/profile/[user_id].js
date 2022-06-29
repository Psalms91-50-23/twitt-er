import { useState, useEffect } from 'react';
import { client, urlFor } from '../../../lib/client';
import Image from 'next/image';
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

  // const router = useRouter();
  // if(typeof window !== 'undefined' && router.isFallback){
  //   return (
  //     <div className="">Loading...</div>
  //   )
  // } 

  const { 
    setTweetClicked, 
    setCurrentUserProfile,
    setUser, 
    setOtherUsers } = useStateContext();

  const largeDevicesOnwards = useMediaQuery('(min-width: 900px)');
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [profileImgUrlBackdrop, setProfileImgUrlBackdrop] = useState("");
  const [profileData, setProfileData] = useState(null); //end profile data after onchange
  const [userProfile, setUserProfile] = useState(profile);
  const [fileImage, setFileImage] = useState(null);
  const [thisUser, setThisUser] = useState(user);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [name, setName] = useState("");
  const [fileSizeError, setFileSizeError] = useState(false);

  const { 
    bio, 
    firstName, 
    lastName, 
    profileBackDrop } = userProfile;

  useEffect(() => {
    setProfileData(profile);
    setCurrentUserProfile(profile);
    setOtherUsers(otherUsers)
  }, [])

  useEffect(() => {
    if(name){
      const usersFiltered = otherUsers.filter(user => user.userName.includes(name));
      setFilteredUsers(usersFiltered)
    }else {
      setFilteredUsers([])
    }
  }, [name,otherUsers])
  
  
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
      setFileImage(selectedFile);
    }

  };

  const onChangeProfile = (e) => {

    if(e.target.name == "profileBackDrop"){
      setImageLoading(true);
      setUserProfile({...userProfile, [e.target.name] : e.target.value})
      if(e.target.value == profile.profileBackDrop){
        setImageLoading(false);
      }
    } else{
      setUserProfile({...userProfile, [e.target.name] : e.target.value})
    }
  }

  const updateUserDetails = () => {
    setIsLoading(true);
    if(fileImage){
  
        client.assets
        .upload('image', fileImage, { contentType: fileImage.type, fileName: fileImage.name})
        .then(imgAsset => {
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
        .then((response) => {

          const uploadImgDoc = {
            ...thisUser,
            profileImage: {
              _type: 'image',
              asset: {
                _type: "reference",
                _ref: response._id
              }
            }
          }
          //updating user table
          client.patch(thisUser._id)
          .set(uploadImgDoc)
          .commit()
          .then(updatedUserRes => {
            setThisUser(updatedUserRes)
            setUser(updatedUserRes)

            const doc = {
              ...userProfile,
              profileBackDrop: profileBackDrop !== profile.profileBackDrop ? profileBackDrop : profile.profileBackDrop
            }

            //updating profile table
            client.patch(profile._id)
            .set(doc)
            .commit()
            .then(res => {
              setProfileData(res);
              setCurrentUserProfile(res);
              setIsEdit(!isEdit);
              setImageLoading(false);
              setIsLoading(false);
            })
          })
        })
    }
     else {

       const profileDoc = {
         ...userProfile,
         profileBackDrop: profileBackDrop !== profile.profileBackDrop ? profileBackDrop : profile.profileBackDrop
       }
      client.patch(profile._id)
      .set(profileDoc)
      .commit()
      .then(res => {
        setProfileData(res);
        setCurrentUserProfile(res);
        setIsEdit(!isEdit);
        setImageLoading(false);
        setIsLoading(false);
      })
     }
  }
  
  const toggle = () => {
    setFileImage(null);
    setIsEdit(!isEdit)
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
        { isLoading ? (
          <div className="spinner-bg-container">
            <div className="spinner-bg-content">
              <WormSpinner />
            </div>
          </div>
        )
        : (
        <div className="current-user-picture-container">
          <div className="current-user-images-container">
            { imageLoading ? (
              <div className="spinner-image">
                <Spinner 
                  message={"Loading..."} 
                  bgColor={"transparent"} 
                  outerCircle={"rgb(29 161 242"}
                  innerCircle={"rgba(255,255,255,1)"}
                />
              </div>
            )
            :
              <img
                className={"current-user-backdrop"}
                src={ profileData?.profileBackDrop ? profileData.profileBackDrop : "http://www.brandgradients.com/img/backgrounds/twitter-hex-colors-gradient-background.png"} alt={ profileData?.profileBackDrop ? "profile backdrop" : "default profile backdrop" }
              />
            }
            <img 
              className="current-user-profile-image"
              src={ thisUser?.profileImage ? urlFor(thisUser.profileImage.asset._ref) : thisUser?.imageUrl } alt="profile pic"
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
                  />
                </div>
                <div className="profile-image-container">
                  <span className="name-text">Profile Image: </span>
                  <input 
                    type={"file"}
                    name="profileImageBackdrop"
                    className="image-input-comp"
                    // value={lastName}
                    onChange={e => uploadImage(e)}
                  />
                </div>
                <div className="backdrop-imageurl-container">
                  <span className="name-text">Backdrop image: </span>
                  <input 
                    autoComplete="off"
                    name="profileBackDrop"
                    value={profileBackDrop}
                    className="background-image-input"
                    onChange={e => onChangeProfile(e)}
                    placeholder="Url of image here..."
                  />
                </div>
                <div className="bio-input-container">
                  <span className="name-text">Bio: </span>
                  <textarea 
                    name="bio"
                    className="bio-input"
                    rows="3"
                    value={bio}
                    resize={"none"}
                    onChange={e => onChangeProfile(e)}
                  />
                </div>
                <div className="submit-edit-container">
                  <RoundButton 
                      buttonStyle={buttonStyles}
                      onClickEvent={() => updateUserDetails()}
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
            <ProfileWidget users={ filteredUsers?.length ? filteredUsers : otherUsers}/>
          </div>
        )
        }
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ params: { user_id }}) => {
  
    const baseURL = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/development?query=`;
    const query = encodeURIComponent(`*[_type == "user" && _id == '${user_id}'][0]`);
    const usersQuery = `*[_type == "user" && _id != '${user_id}']`;
    const profileQuery = encodeURIComponent(`*[_type == "profile" && userId._ref =='${user_id}']`);
    const user = await await fetch(`${baseURL}${query}`).then(res => res.json());
    const otherUsers = await client.fetch(usersQuery);
    const userProfile = await fetch(`${baseURL}${profileQuery}`).then(res => res.json());

    return {
      props: { 
        user: user.result,
        otherUsers,
        profile: userProfile.result[0]
       },
    }
}

export default HomeProfile