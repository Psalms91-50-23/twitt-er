import { useState, useEffect } from 'react';
import {useRef} from 'react';
import { useStateContext } from '../../context/StateContext';
import { ImCross } from "react-icons/im";
import { urlFor, client } from '../../lib/client';
import { Icon } from '../icon';
import { AiOutlineFileImage } from "react-icons/ai";
import { MdComputer } from "react-icons/md";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import {  buttonStyles, buttonContainerStyle, feedIconStyles } from '../../styles/custom';
import { RoundButton, CustomInput, Loading } from '../';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { WormSpinner } from "../";

const TweetHead = () => {
    const { 
        user, 
        setCurrentUserTweets,
        currentUserTweets,
        setIsLoading,
        addTweet,
    } = useStateContext();
    
    const smallToMediumDevices = useMediaQuery('(max-width: 660px)');
    const smallDevice = useMediaQuery('(max-width: 470px)')
    const inputRef = useRef(null);
    const [fieldError, setFieldError] = useState(false);
    const [tweetTitleError, setTweetTitleError] = useState(false);
    const [tweet, setTweet] = useState("");
    const [loading, setLoading] = useState(false);
    //for video url
    // const [videoUrl, setVideoUrl] = useState("");
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

    const setIsLoadingTrue = () => {
        setLoading(true);
    }

    const addNewTweet = () => {
        if(!tweetTitle){
            setTweetTitleError(true);
            return
        }
        console.log({tweetTitle});
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
            addTweet(doc);
            resetStates();
        }else if((tweetImageUrl || tweetVideoUrl) && tweet) {
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
        }
        if(tweet){
            console.log(doc);
            resetStates();
            addTweet(doc)
        }
        // else if((tweetImageUrl || tweetImage || videoUrl) && tweet){
             if(tweetImageUrl || videoUrl){
                 doc = {
                     ...doc,
                     tweetImageUrl: tweetImageUrl ? tweetImageUrl : "",
                     tweetVideoUrl: tweetVideoUrl ? tweetVideoUrl : ""
                 }
                 console.log({doc})
                 tempTweets.unshift(doc)
                 setCurrentUserTweets(tempTweets)
                  setComputerImgUploading(false);
                 resetStates();
                 setIsLoading(false);
                 client.create(doc)
                 .then(response => {
                      var tempTweets = currentUserTweets;
                      tempTweets.unshift(response)
                      setCurrentUserTweets(tempTweets)
                      setIsLoading(false);
                      return
                 })
                 .catch(error => {
                     console.log({error});
                 })
             }

             console.log("before tweetImage");
             if(tweetImage){
                 setIsLoading(true);
                 client.assets
                 .upload('image', tweetImage, 
                 { contentType: tweetImage.type, filename: tweetImage.name  })
                 .then((document) => {

                     doc = {
                         ...doc,
                         tweetImage: {
                             _type: 'image',
                             asset: {
                                 _type: 'reference',
                                 _ref: document._id
                             }
                         }
                     }

                     client.create(doc)
                     .then(response => {
                        //  save object to front of array with unshift
                         tempTweets.unshift(response)
                         setCurrentUserTweets(tempTweets)
                         resetStates();
                         setIsLoading(false);
                         return
                     })
                     .catch(error => {
                         console.log({error});
                     })
                })
                .catch((error) => {
                     console.log('Upload failed:', error.message);
                     setIsLoading(false);
                });
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
            { (user?.profileImage?.asset || user?.imageUrl ) ? (
                <img 
                    className="tweet-user-image"
                    src={user?.profileImage?.asset ? urlFor(user.profileImage.asset) : user?.imageUrl} alt="profile image" 
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
                    // name="" id="" 
                    // cols="30" 
                    // rows="10"
                    className="feed-textarea"
                    placeholder="What's on your mind?"
                    onChange={(e) => handleChange(e)}
                    // onChange={(e) => setTweet(e.target.value)}
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
                                { !isImageUrl && !isFile && (
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
                                        iconStyle={feedIconStyles}
                                        clickEvent={() => setIsFile(true)}
                                        titleStyle={titleStyle}
                                        containerStyle={containerStyle}
                                    />
                                    )
                                }
                                { isFile && !isImageUrl && (
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
                                        <span className="feed-file-upload-text">
                                            Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB
                                        </span>
                                    </div>
                                    )
                                }
                            </div>
                        </div>
                        { tweetTitleError  && (
                            <span className="missing-field-msg">
                                Require text in text field
                            </span>
                        )
                        }
                        {/* { fieldError  && (
                            <span className="missing-field-msg">
                                Require one of these fields: Image URL, Video URL or Computer Image from Desktop
                            </span>
                        )
                        } */}
                        { wrongImageType  && (
                            <span className="missing-field-msg">
                                Require one of these fields: Image URL, Video URL or Computer Image from Desktop
                            </span>
                        )
                        }
                        
                    </div>
                    <RoundButton 
                        text={"Tweet"} 
                        buttonStyle={{...buttonStyles, backgroundColor: "rgba(29,155,240,0.7)"}} 
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