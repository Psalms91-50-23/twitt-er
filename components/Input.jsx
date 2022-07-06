import { useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

const Input = ({ 
    password, 
    userName, 
    displayName, 
    nameWidth, 
    setUserDetails, 
    setErrorMsg, 
    errorMsg, 
    userDetails, 
    topRightBorderWidth, 
    botLeftBorderWidth, 
    topRightCornerColor, 
    botLeftCornerColor, 
    colorText,
    inputBorderColor, 
    inputWidth, 
    inputHeight, 
    marginBottom }) => {

    const [ inputValue, setInputValue ] = useState(password? {password: ""} : userName? {userName: ""} : {displayName: ""})
    const [ inputAnimation, setInputAnimation ] = useState({
        inputTransition: false,
        inputTop: false,
        inputBottom: true
    })

    const [ show, setShow ] = useState(true);
    const { inputTransition, inputTop, inputBottom } = inputAnimation
    const handleChange = (e) => {
       
        if(password ){
            if(errorMsg){
                setErrorMsg(false)
            }
            console.log(e.target.name);
            console.log(e.target.value);
            setInputValue({password : e.target.value})
            setUserDetails({...userDetails, [e.target.name]: e.target.value})
        }
        else if(userName){
            if(errorMsg){
                setErrorMsg(false)
            }
            console.log(e.target.name);
            console.log(e.target.value);
            setInputValue({userName: e.target.value})
            setUserDetails({...userDetails, userName: e.target.value})
        }
        else if(displayName){
            if(errorMsg){
                setErrorMsg(false)
            }
            console.log(e.target.name);
            setUserDetails({...userDetails, displayName: e.target.value})
            console.log(e.target.value);
            setInputValue({displayName: e.target.value})
        }
    }

    const handleInputHasFocus = () => {
        console.log("has focus");
        setInputAnimation({
            ...inputAnimation,
            inputTransition: true,
            inputTop: true,
            inputBottom: false, 
        })
    }

    const handleInputLostFocus = () => {
        console.log("lost focus");
        if(inputValue.userName?.length ||
            inputValue.password?.length ||
            inputValue.displayName?.length){
            setInputAnimation({ inputTop: true, inputTransition: false, inputBottom: false })
          }else{
            setInputAnimation({ inputTop: false, inputTransition: true, inputBottom: true })
            setTimeout(() => {
                setInputAnimation({ inputTop: false, inputTransition: false, inputBottom: true })
            },[250])
        }
        
    }
    const style = {
        width: nameWidth? nameWidth : "",

    }

    console.log(inputValue);
    console.log(inputAnimation);
    console.log("error msg in input ", errorMsg)
   
  return (
    <form autoComplete="off" className="input-formContainer" style={{marginBottom: marginBottom}}>
        <div className={"input-container"}>
            <input 
                className="input" 
                autoComplete={password? "password" : "new-text"}
                value={displayName ? inputValue.displayName : password ? inputValue.password : userName? inputValue.userName : ""}
                type={show && password? "password" : "text"} 
                onFocus={handleInputHasFocus} 
                onBlur={handleInputLostFocus}
                name={password? password : userName ? userName : displayName}
                onChange={(e) => handleChange(e)}
                required
                style={{border: inputBorderColor? inputBorderColor : "",
                    width: inputWidth? inputWidth : "",
                    height: inputHeight? inputHeight : ""}}
            />
            <div 
                className={"input-headerContainer" + 
                (inputTransition && inputTop && !inputBottom ? " input-slideUp"
                : inputTransition && !inputTop && inputBottom ? " input-slideDown" 
                : !inputTransition && inputTop && !inputBottom? " input-slideUp" 
                : "")}
                style={{ width: nameWidth? nameWidth : ""}}
            >
                {
                userName? (
                    <span style={{color: colorText? colorText : ""}}>
                    {userName.charAt(0).toUpperCase()+userName.substring(1,userName.length)}
                    </span>
                    )
                :
                password? (
                    <span style={{color: colorText? colorText : ""}}>
                        {password?.charAt(0).toUpperCase()+password.substring(1,password.length)}
                    </span>
                )
                :
                <span style={{color: colorText? colorText : ""}}>
                    {displayName.charAt(0).toUpperCase()+displayName.substring(1,displayName.length)}
                </span>
                }
                <div className={ 
                inputTransition && inputTop && !inputBottom ? "bottom-leftCorner" 
                : inputTransition && !inputTop && inputBottom ? "bottom-leftCorner" 
                : !inputTransition && inputTop && !inputBottom? "bottom-leftCorner"
                : !inputTransition && !inputTop && inputBottom ? ""
                : ""}
                style={{ width: botLeftBorderWidth? botLeftBorderWidth : "", 
                    borderTop: "none", borderRight: "none",
                    borderBottom: botLeftCornerColor && inputTop || inputTransition && inputBottom ? botLeftCornerColor : "", borderLeft: botLeftCornerColor && inputTop || inputTransition && inputBottom ? botLeftCornerColor : ""}}
                ></div>
                <div className={ 
                inputTransition && inputTop && !inputBottom ? 
                "top-rightCorner" 
                : inputTransition && !inputTop && inputBottom ? "top-rightCorner" 
                : !inputTransition && inputTop && !inputBottom? "top-rightCorner"
                : !inputTransition && !inputTop && inputBottom ? "" 
                : ""}
                style={{ width: topRightBorderWidth? topRightBorderWidth : "",
                        borderBottom: "none", borderLeft: "none",
                        borderRight: topRightCornerColor && inputTop || inputTransition && inputBottom ? topRightCornerColor : "", borderTop: topRightCornerColor && inputTop || inputTransition && inputBottom ? topRightCornerColor : ""}}
                ></div>
            </div>
            { password && (
                <div className="eye-inputContainer">
                { show ? 
                    <AiFillEyeInvisible
                        onClick={() => setShow(!show)}
                    />
                    :
                    <AiFillEye
                        onClick={() => setShow(!show)} 
                    />
                }
                </div>
                )
            } 
        </div> 
    </form>
     
  )
}

export default Input