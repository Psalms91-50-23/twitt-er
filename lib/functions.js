const characters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p",
"q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G",
"H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V", "W","X", 
"Y","Z","0","1","2","3","4","5","6","7","8","9","!","@","#","$","%","^","&","*"]
const emailRegex = /^(\w{3,})@([a-zA-Z\d\-]{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;
// const emailRegex = /^(\w{3,})@([a-zA-Z\d]{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;
//70 characters in total
let encodedNum = null;
let passwordEncoded = null;
let newExtension;
let originalExtension;
import { client } from "./client";

export function validateEmail(userEmail){
    if(emailRegex.test(userEmail)) return true;
    else return false;
}

export function findUser(users, email){
    const foundUser = users.find((user) => {
         if(user.userName.toLowerCase() === email.toLowerCase()){
            return user;
         }
    });
    if(foundUser) return foundUser;
}

export function encodePassword( password ){
    let passwordChar = password.split("");
    encodedNum = [];
    passwordEncoded = "";
    for(var i = 0 ; i < passwordChar.length ; i ++){
        let numOfHashCharToAdd = Math.floor(Math.random()*9)+1;
        for(var j = 0 ; j <= numOfHashCharToAdd ; j ++){   
            let randomCharIndex = Math.floor(Math.random()*70);
            let tempChar = characters[randomCharIndex];
            
            if( j ===  numOfHashCharToAdd ){
                passwordEncoded += passwordChar[i];
                encodedNum.push(passwordEncoded.split("").length);
                // passwordEncoded += process.env.NEXT_PUBLIC_SECRET;
            }else{
                passwordEncoded += tempChar;
            }
        }
        if(i === passwordChar.length-1){
            passwordEncoded += process.env.NEXT_PUBLIC_SECRET;
        }
    }
    return passwordEncoded;
}

export function matchSecret( foundUser, secret ){
    const { password, passwordEncodedPattern } = foundUser;
    const encodedPattern = JSON.parse(passwordEncodedPattern);
    const secretMatch = password.slice(encodedPattern[encodedPattern.length-1]);
    if(secretMatch === secret) return true;
}

export function getEncodedPattern(){
    return encodedNum;
}

export function decodePassword( encodedPattern, hashPassword ){
    let passwordDecoded = "";
    for( var i = 0 ; i < encodedPattern.length ; i++ ){
        let passwordCharIndex = encodedPattern[i];
        passwordDecoded += hashPassword.charAt(passwordCharIndex-1);
    }
    return passwordDecoded;
}

export function isEmailMatch({ userName }, email){
    // const { userName } = foundUser;
    if( userName === email ) return true;
}

export function isPasswordMatch(foundUser, userPassword ){
    const { passwordEncodedPattern, password } = foundUser;
    const passwordDecoded = decodePassword( JSON.parse(passwordEncodedPattern), password );
    // console.log({passwordDecoded});
    if( passwordDecoded === userPassword ) return true;
}

export function loginUser(endPoint, data) {
    // /api/login
    fetch(`${endPoint}`, {
        method: "POST",
        headers: {
          'Content-type' : 'application/json'
        },
        body: JSON.stringify({token: data})
        // body: JSON.stringify(`${_id}${process.env.NEXT_PUBLIC_SECRET}`)
      })
}

export function logoutUser(endPoint) {
    fetch(`${endPoint}`, {
        method: "POST",
        headers: {
          'Content-type' : 'application/json'
        },
        body: JSON.stringify({})
      })
}

export async function getAllUsers(){
    const query = `*[ _type == "user"]`
    const users = await client.fetch(query);
    // console.log({users});
    return users;
}

export async function getCurrentUser(userId){
    const query = `*[ _type == "user" && _id == "${userId}"]`
    const foundUser = await client.fetch(query);
    return foundUser[0];
}

export async function getAllUserTweets(userId){
    const query = `*[ _type == "tweet" && userId == "${userId}"] | order(_createdAt desc)`
    const tweets = await client.fetch(query);
    // console.log({tweets});
    return tweets;
}

export function getNewImageExtension(imageFormat){

    if(imageFormat.includes("-png")){
        newExtension = ".png";
        originalExtension = "-png";
      }
      else if(imageFormat.includes("-jpg")){
        newExtension = ".jpg";
        originalExtension = "-jpg";
      }
      else if(imageFormat.includes("-gif")){
        newExtension = ".gif";
        originalExtension = "-gif";
      }
      else if(imageFormat.includes("-jpeg")){
        newExtension = ".jpeg";
        originalExtension = "-jpeg";
      }
      else if(imageFormat.includes("-svg")){
        newExtension = ".svg";
        originalExtension = "-svg";
      }
      else {
        newExtension = ".tiff";
        originalExtension = "-tiff";
      }
    return newExtension;
}

export function getOldImageExtension(){
    return originalExtension;
}

// export function userLogin(foundUser, password, email, setEmailError, setPasswordError, setUser, setComplete, setLoading ){
//     console.log("1");
//     if(!foundUser) return setEmailError(true);
//     // const { passwordEncodedPattern, userName } = foundUser;
//     if(!isEmailMatch(foundUser,email)) return setEmailError(true);
//     if(!isPasswordMatch(foundUser, password)) return setPasswordError(true);
//     setUser(foundUser);
//     setLoading(false);
//     setComplete(true);
//     console.log("2");
//     return 
// }