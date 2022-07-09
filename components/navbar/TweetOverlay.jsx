import { useState, useEffect } from 'react';
import {useRef} from 'react';
import { ImCross } from "react-icons/im";
import { urlFor } from '../../lib/client';
import { RoundButton, Loading } from '../';
import { Icon } from '../icon';
import { MdComputer } from "react-icons/md";
import { FaArrowAltCircleLeft, FaPhotoVideo } from "react-icons/fa";
import { BsFillEmojiSmileFill, BsEmojiSmile } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";
import { useStateContext } from '../../context/StateContext';
import { AiOutlineFileImage } from "react-icons/ai";
import { iconStyles, buttonStyles, buttonContainerStyle, feedIconStyles  } from '../../styles/custom';
import { v4 as uuidv4 } from 'uuid';
import useMediaQuery from '../../hooks/useMediaQuery';

const TweetOverlay = ({ 
  currentUser, 
  hideTweet, 
   }) => {
  
  const {
  user,
  isTweetClicked, 
  setIsTweetClicked,
  addTweet,
  isLoading,
  setIsLoading } = useStateContext();

  const inputRef = useRef(null);
  const smallToMediumDevices = useMediaQuery('(max-width: 660px)');
  const smallDevice = useMediaQuery('(max-width: 470px)')
  const [fieldError, setFieldError] = useState(false);
  const [tweetTitleError, setTweetTitleError] = useState(false);
  const [tweet, setTweet] = useState("");
  const [loading, setLoading] = useState(false);
  //for video url
  const [videoUrl, setVideoUrl] = useState("");
  const [isVideoUrl, setIsVideoUrl] = useState(false);
  // const [isVideoUrl, setIsVideoUrl] = useState(false);
  //image url
  const [imageUrl, setImageUrl] = useState("");
  const [isImageUrl, setIsImageUrl] = useState(false);
  //image file from computer
  const [tweetImage, setTweetImage] = useState("");
  const [isFile, setIsFile] = useState(false);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [tweetDoc, setTweetDoc] = useState({
      _createdAt: "",
      _id: "",
      _type: "tweet",
      tweetTitle: "",
      tweetImageUrl: "",
      tweetVideoUrl: "",
      userId: "",
      tweetedBy: {
          _type: 'tweetedBy',
          _ref:""
      }
  })

  const { tweetTitle, tweetImageUrl, tweetVideoUrl } = tweetDoc;
  
  useEffect(() => {
    if(!tweetDoc.tweetTitle){
        setIsLoading(false);
        setLoading(false);
    }
  }, [tweetDoc.tweetTitle, setLoading, setIsLoading])

  useEffect(() => {
    setFieldError(false);
    setTweetDoc( tdoc => ({...tdoc, tweetImageUrl: imageUrl}));
  },[imageUrl, setFieldError, setTweetDoc])

  useEffect(() => {
      setFieldError(false);
      setTweetDoc( tdoc => ({...tdoc, tweetVideoUrl: videoUrl}))
  }, [videoUrl, setTweetDoc, setFieldError ])

  useEffect(() => {
      setFieldError(false);
      setTweetDoc(tdoc => ({...tdoc, tweetTitle: tweet}))
  }, [tweet, setFieldError, setTweetDoc])
  

  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];
    const { type } = selectedFile;
    if(selectedFile){
        if ( type  === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff' || type === 'image/jpg') {
            setWrongImageType(false);
            setTweetImage(selectedFile)
        } else {
          setWrongImageType(true);
        }
    }
  };

  const resetStates = () => {
    setTweet("");
    setTweetImage("");
    setVideoUrl("");
    setImageUrl("");
    setIsFile(false);
    setIsImageUrl(false);
    setTweetDoc({
        _createdAt: "",
        _id: "",
        _type: "tweet",
        tweetTitle: "",
        tweetImageUrl: "",
        tweetVideoUrl: "",
        userId: "",
        tweetedBy: {
            _type: 'tweetedBy',
            _ref:""
        }
    })
  }

  const resetFileInput = () => {
    // 👇️ reset input value
    inputRef.current.value = null;
  };

  const resetField = (fieldName) => {
    setTweetDoc({...tweetDoc, [fieldName] : ""})
  }

  const addNewTweet = () => {
    if(!tweet){
        setTweetTitleError(true);
        return
    }
    const { tweetImageUrl, tweetVideoUrl } = tweetDoc;
    setIsLoading(true);
    const date = new Date();
    let doc = {
        ...tweetDoc,
        _createdAt: date.toISOString(),
        _id: uuidv4(),
        userId: user._id,
        tweetTitle: tweet,
        tweetedBy: {
            _type: 'tweetedBy',
            _ref: user._id
        }
    }

    if(tweet){
        resetStates();
        addTweet(doc);
    }else if((imageUrl || videoUrl) && tweet) {
        doc = {
            tweetImageUrl: tweetImageUrl ? tweetImageUrl : "",
            tweetVideoUrl: tweetVideoUrl? tweetVideoUrl : "",
            tweetedBy: {
                _type: 'tweetedBy',
                _ref: user._id
            }
          }
        addTweet(doc)
        resetStates();
    }else {

    }
  }

  
  const handleChange = (e) => {
    setTweetTitleError(false);
    if(e.target.name !== "tweetImage"){
        setTweetDoc({...tweetDoc, 
            [e.target.name] : e.target.value,
            tweetedBy: {
                ...tweetDoc.tweetedBy,
                _ref: currentUser._id,
            },
            _id: uuidv4(),
            userId: currentUser._id
        });
    }else {
      const selectedFile = e.target.files[0];
      const { type } = selectedFile;
      if(selectedFile){
          if ( type  === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' 
          || type === 'image/tiff' || type === 'image/jpg' || type === 'image/webp') {
              setTweetDoc({...tweetDoc, 
                  [e.target.name] : selectedFile,
                  tweetedBy: {
                      ...tweetDoc.tweetedBy,
                      _ref: currentUser._id,
                  },
                  _id: uuidv4(),
                  userId: currentUser._id
              });
              setWrongImageType(false);
              setTweetImage(selectedFile)
          } else {
            setWrongImageType(true);
          }
      }
    }
  }

  const newTweet = () => {
    const { tweetTitle } = tweetDoc;
    if(!tweetTitle){
        setTweetTitleError(true);
        return
    }
    const date = new Date();
    setLoading(true);
    setIsLoading(true);
    addTweet({...tweetDoc, _createdAt: date.toISOString()}, resetStates);    
}

  const containerStyle = {
    marginRight: "10px"
  }

  const titleStyle = {
    color: "rgba(29,155,240,1)",
    fontSize: "12px"
  }

  const roundButtonContainer = {
    ...buttonContainerStyle,
    placeSelf: "center"
  }

  return (
    <div 
      className={"tweet-overlay-container"}
    >
      <span
        className="tweet-cancel-icon"
        onClick={() => setIsTweetClicked(false)}
      >
        <BiArrowBack size={30}/>
      </span>
      <div className="tweet-overlay-content-container">
        <div className="tweet-overlay-body">
          <div className="tweet-user-image-container">
            <img src={currentUser?.profileImage?.asset ? urlFor(currentUser.profileImage.asset) : currentUser.imageUrl } alt="" className="tweet-user-image" />
          </div>
          {
            loading ? (
              <Loading />
          )
          :
            <div className="tweet-user-input-container">
              <div className="tweet-overlay-textarea-container">
                <textarea 
                  className="tweet-overlay-textarea"
                  placeholder="What's on your mind?"
                  onChange={(e) => setTweet(e.target.value)}
                  value={tweet}
                />
                <span 
                  className="delete-textarea"
                  onClick={() => setTweet("")}
                >
                <ImCross size={18}/>
                </span>
              </div>
              <div className="tweet-buttons-container">
                <div className="tweet-icons-container">
                  <div className="tweet-icon-buttons">
                    { !isImageUrl && !isFile && !isVideoUrl && (
                      <Icon 
                          icon={<AiOutlineFileImage size={25}/>} 
                          iconStyle={feedIconStyles}
                          clickEvent={() => setIsImageUrl(true)}
                          titleStyle={titleStyle}
                          containerStyle={{...containerStyle}}
                      />
                      )
                    }
                    { isImageUrl && !isFile && !isVideoUrl && (
                      <div className="tweet-url-input-container">
                        <input 
                            className="feed-url-input"
                            type="text" 
                            onChange={(e) => handleChange(e)}
                            value={tweetImageUrl} 
                            name="tweetImageUrl"
                            placeholder="Image url here..."
                        />
                        <span 
                            className="cancel-url-input"
                            onClick={() => resetField("tweetImageUrl")}
                        >
                            <ImCross size={18}/>
                        </span>
                        <span 
                            className="back"
                            onClick={() => setIsImageUrl(false)}
                        >
                            <FaArrowAltCircleLeft size={25}/>
                        </span>
                      </div>
                      )
                    }
                    { !isFile && !isImageUrl && !isVideoUrl && (
                      <Icon 
                          icon={<MdComputer size={25}/>} 
                          iconStyle={feedIconStyles}
                          clickEvent={() => setIsFile(true)}
                          titleStyle={titleStyle}
                          containerStyle={containerStyle}
                      />
                      )
                    }
                    { isFile && !isImageUrl && !isVideoUrl && (
                      <div className="tweet-file-input-container">
                          <div 
                              className="tweet-head-add-file-container" 
                          >    
                            <input 
                                type="file"
                                className="feed-file-upload-input"
                                name="tweetImage"
                                onChange={e => handleChange(e)}
                                ref={inputRef}
                            />
                            <span 
                                className="cancel-file-input"
                                onClick={() => resetFileInput()}   
                            >
                                <ImCross size={18}/>
                            </span>
                            <span 
                                className="back"
                                onClick={() => setIsFile(false)}
                            >
                                <FaArrowAltCircleLeft size={25}/>
                            </span>
                          </div>
                          <span 
                            style={{ color: "rgba(0,0,0,1)", fontWeight: "700" }}
                            className="feed-file-upload-text">
                              Recommendation: Use high-quality JPG, JPEG, SVG, PNG, WEBP, GIF or TIFF less than 20MB
                          </span>
                      </div>
                      )
                    }
                    { !isVideoUrl && !isFile && !isImageUrl && (
                      <Icon 
                        icon={<FaPhotoVideo size={25}/>} 
                        iconStyle={feedIconStyles}
                        clickEvent={() => setIsVideoUrl(true)}
                        titleStyle={titleStyle}
                        containerStyle={containerStyle}
                      />
                      )
                    }
                    </div>
                    { tweetTitleError  && (
                        <span className="missing-field-msg">
                            Require text in text field
                        </span>
                      )
                    }
                    { isVideoUrl && !isFile && !isImageUrl && (
                      <div className="tweet-url-input-container">
                        <input 
                            className="feed-url-input"
                            type="text" 
                            onChange={(e) => handleChange(e)}
                            value={tweetVideoUrl} 
                            name="tweetVideoUrl"
                            placeholder="Youtube video url here..."
                        />
                        <span 
                            className="cancel-url-input"
                            onClick={() => resetField("tweetVideoUrl")}
                        >
                            <ImCross size={18}/>
                        </span>
                        <span 
                            className="back"
                            onClick={() => setIsVideoUrl(false)}
                        >
                            <FaArrowAltCircleLeft size={25}/>
                        </span>
                      </div>
                      )
                    }
                    { wrongImageType  && (
                        <span className="missing-field-msg">
                            Require one of these fields: Image URL, Video URL or Computer Image from Desktop
                        </span>
                      )
                      }
                </div>
                <RoundButton 
                  text={"Tweet"} 
                  buttonStyle={buttonStyles} 
                  buttonContainerStyle={ smallDevice? roundButtonContainer : buttonContainerStyle}
                  textColor={"rgb(255,255,255)"}
                  buttonHoverColor={"rgba(29, 155, 240, 1)"}
                  onClickEvent={newTweet}
                />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default TweetOverlay