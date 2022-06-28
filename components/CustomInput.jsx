import { useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { ImCross } from "react-icons/im";

const CustomInput = ({
    passwordValue,
    setPassword,
    userNameValue,
    setUserName,
    imageUrlValue,
    setImageUrl,
    title,
    titleColor,
    borderColor,
    inputBgColor,
    fileInput,
    headerText,
    uploadImage,
    textPlaceHolder,
    inputStyles,
    titleFontWeight,
    titleStyle,
    inputBorderWidth,
    inputRef
}) => {
    
    const [show, setShow] = useState(false);
    const [ inputAnimation, setInputAnimation ] = useState({
        inputTransition: false,
        inputTop: false,
        inputBottom: true
    });
    const { inputTransition, inputTop, inputBottom } = inputAnimation;
    const [inputHasFocus, setInputHasFocus] = useState(false);

    const handleChange = (e) => {
        if(setPassword){
            setPassword(e.target.value);
        }else if(setUserName){
            setUserName(e.target.value);
        }
        else{
            setImageUrl(e.target.value);
        }
    }

    const handleInputHasFocus = () => {
        setInputHasFocus(true);
        setInputAnimation({
            ...inputAnimation,
            inputTransition: true,
            inputTop: true,
            inputBottom: false, 
        })
    }

    const handleInputLostFocus = () => {
        if(userNameValue?.length || passwordValue?.length || imageUrlValue?.length){
            setInputAnimation({ inputTop: true, inputTransition: false, inputBottom: false })
          }else{
            setInputAnimation({ inputTop: false, inputTransition: true, inputBottom: true })
            setTimeout(() => {
                setInputAnimation({ inputTop: false, inputTransition: false, inputBottom: true })
                if(!inputTransition && inputTop && !inputBottom){
                    setInputHasFocus(true);
                }else {
                    setInputHasFocus(false);
                }
            },[250])
        }  
    }

    const handleDelete = () => {
        if(setPassword){
            setPassword("");
            setInputAnimation({ inputTop: false, inputTransition: true, inputBottom: true })
            setTimeout(() => {
                setInputAnimation({ inputTop: false, inputTransition: false, inputBottom: true })
                if(!inputTransition && inputTop && !inputBottom){
                    setInputHasFocus(false);
                }
            },[250]) 
        }
        else if(setUserName){
            setUserName("");
            setInputAnimation({ inputTop: false, inputTransition: true, inputBottom: true })
            setTimeout(() => {
                setInputAnimation({ inputTop: false, inputTransition: false, inputBottom: true })
                if(!inputTransition && inputTop && !inputBottom){
                    setInputHasFocus(false);
                }
            },[250]) 
        }
        else {
            setImageUrl("")
            setInputAnimation({ inputTop: false, inputTransition: true, inputBottom: true })
            setTimeout(() => {
                setInputAnimation({ inputTop: false, inputTransition: false, inputBottom: true })
                if(!inputTransition && inputTop && !inputBottom){
                    setInputHasFocus(false);
                }
            },[250]) 
        }
    }
    
  return (
      <>
        <h4 style={ titleStyle ? {...titleStyle, opacity: !inputHasFocus ? "1" : "0"} 
        : { opacity: !inputHasFocus ? "1" : "0", fontWeight: titleFontWeight ? titleFontWeight 
        : "700", padding: "0px", margin: "0px", color: titleColor && titleColor }}
        >
            {headerText}
        </h4>
        {fileInput ? ( 
            <>
                <div 
                    className="input-container" 
                    style={{ backgroundColor: inputBgColor ?  inputBgColor : "rgb(29, 161, 242)"}}
                >    
                    <input 
                        type="file"
                        className="file-upload-input"
                        onChange={e => uploadImage(e)}
                        ref={inputRef}
                    />
                </div>
                <p className="image-format-msg">
                    Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB
                </p>
            </>           
            )
            :
            <div className="input-container" 
                style={{ 
                    backgroundColor: inputBgColor && inputBgColor, 
                    padding: inputBorderWidth && inputBorderWidth 
                }}
            >
                <input 
                    style={ inputStyles && inputStyles }
                    className={"input"}
                    autoComplete={"off"}
                    // autoComplete={ title === "password" ? "password" : "new-text" }
                    type={ !show && title === "password"? "password" : "text" }
                    value={ title === "password" ? passwordValue 
                    : title === "userName" ? userNameValue 
                    : title === "url" ? imageUrlValue 
                    : ""}
                    // required
                    onChange={e => handleChange(e)}
                    onFocus={(e) => handleInputHasFocus(e)}
                    onBlur={(e) => handleInputLostFocus(e)}
                    placeholder={textPlaceHolder && textPlaceHolder}
                />
                <div 
                    className={"input-title " + (
                    inputTransition && inputTop && !inputBottom ? "input-slide-up"
                    : inputTransition && !inputTop && inputBottom ? "input-slide-down" 
                    : !inputTransition && inputTop && !inputBottom? "input-slide-up" 
                    : "")
                    }
                >
                    <span 
                        className={
                            inputTransition && inputTop && !inputBottom ? 
                            "top-right-border" 
                            : inputTransition && !inputTop && inputBottom ? "top-right-border" 
                            : !inputTransition && inputTop && !inputBottom ? "top-right-border"
                            : ""
                        }
                        style={{
                            borderColor: borderColor ? borderColor : null,
                            borderWidth: inputBorderWidth ? inputBorderWidth : null
                        }}
                    ></span>
                    <span 
                        style={{color: titleColor ? titleColor : null }}
                    >
                        {!inputHasFocus ? "" : headerText}
                    </span>
                    <span 
                        className={ 
                            inputTransition && inputTop && !inputBottom ? "bottom-left-border" 
                            : inputTransition && !inputTop && inputBottom ? "bottom-left-border" 
                            : !inputTransition && inputTop && !inputBottom? "bottom-left-border"
                            : ""
                        }
                        style={{ borderColor: borderColor && borderColor }}
                    ></span>
                </div>
                <div className="input-icon-container">
                { (passwordValue || userNameValue || imageUrlValue) && (
                    <span 
                        className="delete-cross"
                        onClick={handleDelete}
                    >
                        <ImCross size={20}/>
                    </span>
                )
                }
                { title === "password" && ( 
                    <span className="eye-icon">
                        { show && title === "password" ? (
                            <AiFillEyeInvisible
                                size={25}
                                onClick={() => setShow(!show)}
                            />
                            )
                            :
                            <AiFillEye
                                size={25}
                                onClick={() => setShow(!show)} 
                            />
                        }
                    </span>
                    )
                }
                </div>
            </div>
        }
    </>
    )
}

export default CustomInput