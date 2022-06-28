
const characters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p",
"q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G",
"H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V", "W","X", 
"Y","Z","0","1","2","3","4","5","6","7","8","9","!","@","#","$","%","^","&","*"];
//70 characters in total

let encodedNum = null;
let passwordEncoded = null;

const emailRegex = /^(\w{3,})@([a-zA-Z\d]{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;
const capitalLetterRegex = /[A-Z]{1}/; //1 character match A-Z
const lowerCaseLetterRegex = /[a-z]{1};/ //1 character match a-z
const numberRegex = /\d{1}/ //1 digit match 0-9
const specialCharRegex = /[!@#$%^&]{1}/; //must have 1 special character '!@#$%^&*
const minEmailReqRegex = /\w{3,}/;

export function validateEmail(userEmail){
    //test if email matches email regex expression and that it has all the min requirements for an email
    if(emailRegex.test(userEmail)) return true;
    else return false;
}

export function minEmailLength(email){
    const minChar = email.substring(0,3);
    if(minEmailReqRegex.test(minChar)) return true;
    else return false;
}

export function minPasswordCharReqReached(password){
    const passwordArray = password.split("");
    var capitalLetterCounter = 0;
    var lowerCaseLetterCounter = 0;
    var numberCounter = 0;
    var specialCharCounter = 0;
    var minPasswordCharReached = false; 
    //test for length of password, if 5 or lower return false
    if(passwordArray.length <= 5) return minPasswordCharReached;
    //after above condition passes do below
    for(var i = 0; i < passwordArray.length ; i++){
        
        var character = passwordArray[i]
        if(capitalLetterRegex.test(character)){
            capitalLetterCounter++;
        }
        if(numberRegex.test(character)){
            numberCounter++;
        }
        if(lowerCaseLetterRegex.test(character)){
            lowerCaseLetterCounter++;
        }
        if(specialCharRegex.test(character)){
            specialCharCounter++;
        }
        if(capitalLetterCounter >= 1 && numberCounter >= 1 && lowerCaseLetterCounter >= 1 && specialCharCounter >= 1){
            minPasswordCharReached = true;
            return minPasswordCharReached ;
        }
    }
}

export function validatePassword(password){
    if(minPasswordCharReqReached(password)) return true;
    else return false;
}

export function encodePassword(password){
    let passwordChar = password.split("");
    encodedNum = [];
    passwordEncoded = "";
    for(var i = 0 ; i < passwordChar.length ; i ++){
        //this variable will hold how many characters within password to hide actual password
        let numOfHashCharToAdd = Math.floor(Math.random()*10)+1;
        for(var j = 0 ; j <= numOfHashCharToAdd ; j ++){   
            let randomCharIndex = Math.floor(Math.random()*70);
            let tempChar = characters[randomCharIndex];
            if( j ===  numOfHashCharToAdd ){
                //when j loop reaches end add the letter from password in
                passwordEncoded += passwordChar[i];
                //keep track of location of the letter in the array for decoding
                encodedNum.push(passwordEncoded.split("").length);
            }else{
                //add all characters to string
                passwordEncoded += tempChar;
            }
        }
    }
    return passwordEncoded;
}

export function decodePassword( encodedPattern, passwordEncoded ){

    let passwordDecoded = "";
    for( var i = 0 ; i < encodedPattern.length ; i++ ){
        let passwordCharIndex = encodedPattern[i];
        passwordDecoded += passwordEncoded.charAt(passwordCharIndex-1);
    }
    return passwordDecoded;
}

export function matchPassword( password, confirmPassword ){
    if(password === confirmPassword) return true;
    else return false;
}

