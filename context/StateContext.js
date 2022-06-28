import { createContext, useContext, useState, useEffect } from "react";
import { client } from "../lib/client";
import Cookie from "js-cookie";
import { useRouter }  from 'next/router';
const Context = createContext();
const baseUrl = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2022-05-10/data/query/development?query=`;

export const StateContext = ({ children }) => {

    const router = useRouter();
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [isTweetClicked, setIsTweetClicked] = useState(false);
    // const [userId, setUserId] = useState(Cookie.get("token") ? Cookie.get("token").split(process.env.NEXT_PUBLIC_SECRET)[0] : false);
    const [tempTweet, setTempTweet] = useState(null);
    const [isUrl, setIsUrl] = useState(false);
    const [currentUserTweets, setCurrentUserTweets] = useState([]);
    const [updatedUsers, setUpdatedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuHidden, setIsMenuHidden] = useState(true);
    const [otherUser, setOtherUser] = useState(null);
    const [otherUserTweets, setOtherUserTweets] = useState([]);
    const [currentUserProfile, setCurrentUserProfile] = useState(null);
    const [isShowFollows, setIsShowFollows] = useState(false);
    const [otherUsers, setOtherUsers] = useState(null);
    const [latestNews, setLatestNews] = useState([]);
    const [isNews, setIsNews] = useState(false);

    useEffect(() => {

        if(!Cookie.get("token")){
            router.replace("/");    
        }

        if(Cookie.get("token")){
            const userId = Cookie.get("token").split(process.env.NEXT_PUBLIC_SECRET)[0];
            const userQuery = encodeURIComponent(`*[_type == "user" && _id == '${userId}']`);
            const userTweetsQuery = encodeURIComponent(`*[_type == "tweet" && userId == '${userId}'] | order(_createdAt desc)`);
            fetch(`${baseUrl}${userQuery}`)
            .then(res => res.json())
            .then(userData => {
                setUser(userData.result[0]);
                fetch(`${baseUrl}${userTweetsQuery}`)
                .then(res => res.json())
                .then(userTweets => {
                    setCurrentUserTweets(userTweets.result);
                })
                .catch(error => {console.log(error.message)})
            })
            .catch(error => {
                console.log(error.message);
            })
        }
        else{
            const allUserQuery = `*[_type == "user"] | order(_createdAt asc)`;
            fetch(`${baseUrl}${allUserQuery}`)
            .then(res => res.json())
            .then(users => {
                setAllUsers(users.result);
            })
            .catch(error => {console.log(error.message)})
        }
    }, [Cookie.get("token")])

    const addNewUser = (newUser) => {
        setAllUsers([...allUsers, newUser]);
    }

    const addTweet = (tweet, resetStates) => {
        let tempTweets = currentUserTweets;
        const { tweetTitle, tweetImageUrl, tweetVideoUrl } = tweet;
        if(tweetTitle && !tweetImageUrl && !tweetVideoUrl && !tweet.tweetImage){
            tempTweets.splice(0,0,tweet);
            setCurrentUserTweets(tempTweets)
            resetStates();
            client.create(tweet)
            .then(response => {
                tempTweets.splice(0,1,response);
                setCurrentUserTweets(tempTweets)
            })
            .catch(error => {
                console.log({error});
            })
        }
        else if(tweetTitle && tweetImageUrl && !tweet.tweetImage){
            tempTweets.splice(0,0,tweet);
            setCurrentUserTweets(tempTweets);
            resetStates();
            client.create(tweet)
            .then(response => {
                tempTweets.splice(0,1,response);
                setCurrentUserTweets(tempTweets);
            })
            .catch(error => {
                console.log({error});
            })
        
        }else {
            let doc;
            const { tweetImage } = tweet;
            client.assets
            .upload('image', tweetImage, 
            { contentType: tweetImage.type, filename: tweetImage.name })
            .then((document) => {
                doc = {
                    ...tweet,
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
                tempTweets.splice(0,0,response);
                setCurrentUserTweets(tempTweets)
                setIsLoading(false);
                resetStates();
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

    const deleteTweet = (id) => {
        const filteredTweets = currentUserTweets.filter(tweet => tweet._id !== id)
        setCurrentUserTweets(filteredTweets)
        const tweetIdQuery = `*[_type=="tweet" && _id == '${id}']`;
        client.delete({
            query: tweetIdQuery
        })
        .catch(error => console.log(error.message))
        // .then(res => console.log("response ",res))
    }

    const otherProfileTweets = (tweets) => {
        setOtherUserTweets(tweets);
    }

    return (
        <Context.Provider 
            value={{
                user,
                setUser,
                setIsTweetClicked,
                isTweetClicked,
                isMenuHidden,
                setIsMenuHidden,
                setCurrentUserTweets,
                currentUserTweets,
                setIsLoading,
                isLoading,
                setTempTweet,
                tempTweet,
                setIsUrl,
                isUrl,
                addTweet,
                otherUser,
                setOtherUser,
                otherProfileTweets,
                addNewUser,
                allUsers,
                setAllUsers,
                deleteTweet,
                otherUserTweets,
                setOtherUserTweets,
                setCurrentUserProfile,
                currentUserProfile,
                isShowFollows,
                setIsShowFollows,
                setOtherUsers,
                otherUsers,
                setLatestNews,
                latestNews,
                setIsNews,
                isNews  
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const  useStateContext = () => useContext(Context);