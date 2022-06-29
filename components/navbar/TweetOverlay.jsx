import { useState, useEffect } from 'react';
import {useRef} from 'react';
import { ImCross } from "react-icons/im";
import { urlFor } from '../../lib/client';
import { RoundButton, Loading } from '../';
import { Icon } from '../icon';
import { MdComputer } from "react-icons/md";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { BsFillEmojiSmileFill, BsEmojiSmile } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";
import { useStateContext } from '../../context/StateContext';
import { AiOutlineFileImage } from "react-icons/ai";
import { iconStyles, buttonStyles, buttonContainerStyle } from '../../styles/custom';
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
  setIsLoading,
  setCurrentUserTweets,
  currentUserTweets } = useStateContext();

  const [isHover, setIsHover] = useState(false);
  const inputRef = useRef(null);
  const smallToMediumDevices = useMediaQuery('(max-width: 660px)');
  const smallDevice = useMediaQuery('(max-width: 470px)')
  const [fieldError, setFieldError] = useState(false);
  const [tweetTitleError, setTweetTitleError] = useState(false);
  const [tweet, setTweet] = useState("");
  const [loading, setLoading] = useState(false);
  //for video url
  const [videoUrl, setVideoUrl] = useState("");
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

  // useEffect(() => {
  //   if(!isTweetClicked){
  //     setIsSlideLeft(true);
  //   }
  // }, [isTweetClicked])

  useEffect(() => {
    if(!tweetDoc.tweetTitle){
        setIsLoading(false);
        setLoading(false);
    }
  }, [tweetDoc.tweetTitle, setLoading, setIsLoading])

  useEffect(() => {
    setFieldError(false);
    setTweetDoc({...tweetDoc, tweetImageUrl: imageUrl})
  },[imageUrl, setFieldError, setTweetDoc])

  useEffect(() => {
      setFieldError(false);
      setTweetDoc({...tweetDoc, tweetVideoUrl: videoUrl})
  }, [videoUrl, setTweetDoc, setFieldError ])

  useEffect(() => {
      setFieldError(false);
      setTweetDoc({...tweetDoc, tweetTitle: tweet})
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
        // tweetImage: "",
        // publishedAt: "",
        tweetImageUrl: "",
        videoUrl: "",
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
                _ref: user._id,
            },
            _id: uuidv4(),
            // _createdAt: date.toISOString(),
            userId: user._id
        });
    }else {
        const selectedFile = e.target.files[0];
        const { type } = selectedFile;
        if(selectedFile){
            if ( type  === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff' || type === 'image/jpg') {
                setTweetDoc({...tweetDoc, 
                    [e.target.name] : selectedFile,
                    tweetedBy: {
                        ...tweetDoc.tweetedBy,
                        _ref: user._id,
                    },
                    _id: uuidv4(),
                    // _createdAt: date.toISOString(),
                    userId: user._id
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
    color: "rgb(29,155,240)",
    fontSize: "12px"
  }

  const roundButtonContainer = {
    ...buttonContainerStyle,
    placeSelf: "center"
  }

  const { tweetTitle, tweetImageUrl, tweetVideoUrl } = tweetDoc;

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
                    { !isImageUrl && !isFile && (
                      <Icon 
                        icon={<AiOutlineFileImage size={25}/>} 
                        iconStyle={iconStyles}
                        clickEvent={() => setIsImageUrl(true)}
                        titleStyle={titleStyle}
                        containerStyle={containerStyle}
                      />
                    )

                    }
                    { isImageUrl && !isFile && (
                      <div className="tweet-imageurl-input-container">
                          <input 
                              className="feed-imageurl-input"
                              type="text" 
                              onChange={(e) => handleChange(e)}
                              value={tweetImageUrl} 
                              name="tweetImageUrl"
                              placeholder="Image url here..."
                          />
                          <span 
                              className="cancel-imageurl-input"
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
                    { !isFile && !isImageUrl && (
                      <Icon 
                        icon={<MdComputer size={25}/>} 
                        iconStyle={iconStyles} 
                        clickEvent={() => setIsFile(true)}
                        titleStyle={titleStyle}
                      />
                     )

                    }
                    { isFile && !isImageUrl && (
                      <div className="tweet-file-input-container">
                        <div className="tweet-head-add-file-container">    
                          <input 
                              type="file"
                              className="feed-file-upload-input"
                              name="tweetImage"
                              onChange={e => handleChange(e)}
                              ref={inputRef}
                          />
                          <span 
                              className="cancel-file-input"
                              onClick={() =>  resetFileInput()}   
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
                          style={{color: "rgb(0,0,0)", fontStyle: "italic", fontWeight: "500"}}
                          className="feed-file-upload-text"
                        >
                          Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB
                        </span>
                      </div>
                    )
                  }
                  </div>
                  { tweetTitleError  && (
                      <span className="missing-field-msg">
                          Require text in text field
                      </span>
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
                  buttonHoverColor={"rgba(29, 155, 240, 0.8)"}
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