import { useState, useEffect } from 'react';
import {useRef} from 'react';
import { useStateContext } from '../../context/StateContext';
import { ImCross } from "react-icons/im";
import { Icon } from '../icon';
import { AiOutlineFileImage } from "react-icons/ai";
import { MdComputer } from "react-icons/md";
import { FaArrowAltCircleLeft, FaPhotoVideo } from "react-icons/fa";
import { buttonStyles, buttonContainerStyle, feedIconStyles } from '../../styles/custom';
import { RoundButton, Loading } from '../';
import useMediaQuery from '../../hooks/useMediaQuery';
import { v4 as uuidv4 } from 'uuid';
import { WormSpinner } from "../";

const TweetHead = () => {
    const { 
        user, 
        setIsLoading,
        addTweet,
    } = useStateContext();
    
    const smallToMediumDevices = useMediaQuery('(max-width: 660px)');
    const smallDevice = useMediaQuery('(max-width: 470px)')
    const inputRef = useRef(null);
    const [fieldError, setFieldError] = useState(false);
    const [tweetTitleError, setTweetTitleError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(user);
    //for video url
    const [isVideoUrl, setIsVideoUrl] = useState(false);
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

    useEffect(() => {
        if(user){
            setCurrentUser(user);
        }
    }, [user])
    
    const { tweetTitle, tweetImageUrl, tweetVideoUrl } = tweetDoc;
    
    useEffect(() => {
        if(!tweetDoc.tweetTitle){
            setLoading(false);
        }
    }, [tweetDoc.tweetTitle])
    
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

    const containerStyle = {
        marginRight: "10px"
    }

    const resetStates = () => {
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

    const resetField = (fieldName) => {
        setTweetDoc({...tweetDoc, [fieldName] : ""})
    }

    const newTweet = () => {
        const { tweetTitle } = tweetDoc;
        if(!tweetTitle){
            setTweetTitleError(true);
            return
        };
        const date = new Date();
        setLoading(true);
        setIsLoading(true);
        addTweet({...tweetDoc, _createdAt: date.toISOString()}, resetStates);
    };

    const titleStyle = {
        color: "rgba(255,255,255,1)",
        fontSize: "12px"
    };

    const resetFileInput = () => {
        // 👇️ reset input value
        inputRef.current.value = null;
    };

  return (
    <div className="head-tweet-container">
        <div className="tweet-user-image-container">
            { 
            currentUser?.imageUrl ? (
                <img 
                    className="tweet-user-image"
                    src={user?.imageUrl ? user.imageUrl : ""} alt="profile image" 
                />
            )
            : (
                <div className="tweet-user-image">
                    <WormSpinner />
                </div>
            )
            }
        </div>
        { loading ? (
            <Loading />
        )
        :
        <>
            <div className="tweet-user-input-container">
                <div className="feed-textarea-container">
                    <textarea 
                    className="feed-textarea"
                    placeholder="What's on your mind?"
                    onChange={(e) => handleChange(e)}
                    value={tweetTitle}
                    name="tweetTitle"
                    />
                    <span 
                        className="delete-textarea"
                        onClick={() => resetField("tweetTitle")}
                    >
                    <ImCross size={18}/>
                    </span>
                </div>
                <div className="feed-tweet-buttons-container">
                    <div className="tweet-icons-container">
                        <div className="tweet-icons-user-inputs">
                            <div className="tweet-head-icons">
                                { !isImageUrl && !isFile && !isVideoUrl && (
                                    <Icon 
                                        icon={<AiOutlineFileImage size={25}/>} 
                                        iconStyle={feedIconStyles}
                                        clickEvent={() => setIsImageUrl(true)}
                                        titleStyle={titleStyle}
                                        // title={"Image Url"}
                                        containerStyle={containerStyle}
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
                                        <span className="feed-file-upload-text">
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
                            </div>
                        </div>
                        { tweetTitleError && (
                            <span className="missing-field-msg">
                                Require text &quot;what&apos;s on your mind&quot; field
                            </span>
                        )
                        }
                        { wrongImageType  && (
                            <span className="missing-field-msg">
                                Require one of these fields: Image URL or Computer Image from Desktop
                            </span>
                        )
                        }
                        
                    </div>
                    <RoundButton 
                        text={"Tweet"} 
                        buttonStyle={{...buttonStyles, backgroundColor: "rgba(29,155,240,0.7)", cursor: "pointer"}} 
                        buttonContainerStyle={ smallToMediumDevices && !smallDevice ? {...buttonContainerStyle, alignSelf: "flex-start"} : smallToMediumDevices &&  smallDevice ? {...buttonContainerStyle, alignSelf: "center"} : buttonContainerStyle }
                        textColor={"rgb(255,255,255)"}
                        buttonHoverColor={"rgba(29, 155, 240, 1)"}
                        onClickEvent={newTweet}
                    />
                </div>
            </div>
        </>
        }
    </div>
  )
}

export default TweetHead