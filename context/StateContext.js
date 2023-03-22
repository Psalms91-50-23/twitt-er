import { createContext, useContext, useState, useEffect } from "react";
import { client } from "../lib/client";
import Cookie from "js-cookie";
// import { useRouter }  from 'next/router';
import { queryUser, queryUserTweets, queryAllUsers, queryTweet } from "../lib/queries";
import { sanityBaseURL } from "../lib/functions"; 
const Context = createContext();

export const StateContext = ({ children }) => {

    // const router = useRouter();
    const [token, setToken] = useState(Cookie.get("token") ? Cookie.get("token") : null);
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [isTweetClicked, setIsTweetClicked] = useState(false);
    const [currentUserTweets, setCurrentUserTweets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [otherUser, setOtherUser] = useState(null);
    const [otherUserTweets, setOtherUserTweets] = useState([]);
    const [currentUserProfile, setCurrentUserProfile] = useState(null);
    const [otherUsers, setOtherUsers] = useState(null);
    const [latestNews, setLatestNews] = useState([]);
    const [isShowFollows, setIsShowFollows] = useState(false);
        
    useEffect(() => {
        // const cookieToken = Cookie.get("token") ? Cookie.get("token") : ""
        // if(cookieToken){
        //     setToken(cookieToken);
        // }
        // if(cookieToken || Cookie.get("token")){
        if(Cookie.get("token")){
            const userId = Cookie.get("token").split(process.env.NEXT_PUBLIC_SECRET)[0];
            const userQuery = encodeURIComponent(queryUser(userId));
            const userTweetsQuery = encodeURIComponent(queryUserTweets(userId));
            const fetchData = async () => {
                try {
                    const results = await Promise.all([
                        fetch(`${sanityBaseURL}${userQuery}`),
                        fetch(`${sanityBaseURL}${userTweetsQuery}`)
                    ])
                    const finalData = await Promise.all(results.map(result => result.json()));
                    setUser(finalData[0].result);
                    setCurrentUserTweets(finalData[1].result);
                }catch(error){
                    console.log(error.message);
                }
            }
            fetchData();
        }
        else{
            fetch(`${sanityBaseURL}${encodeURIComponent(queryAllUsers())}`)
            .then(res => res.json())
            .then(users => {
                setAllUsers(users.result);
            })
            .catch(error => {console.log(error.message)})
        }
    }, [])

    const addNewUser = (newUser) => {
        if(allUsers?.length){
            setAllUsers([...allUsers, newUser]);
        }else {
            setAllUsers([newUser])
        }
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
                setIsLoading(false);
            })
            .catch(error => {
                console.log({error});
            })
        }
        else if((tweetTitle && tweetImageUrl && !tweet.tweetImage) 
            || (tweetTitle && tweetVideoUrl && !tweet.tweetImage)){
            tempTweets.splice(0,0,tweet);
            setCurrentUserTweets(tempTweets);
            resetStates();
            client.create(tweet)
            .then(response => {
                tempTweets.splice(0,1,response);
                setCurrentUserTweets(tempTweets);
                setIsLoading(false);
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
            .then((imgAsset) => {
                const { url, size, path, originalFilename, assetId, _id } = imgAsset;
                doc = {
                    ...tweet,
                    tweetImage: {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: _id
                        }
                    },
                    originalFilename,
                    path,
                    size,
                    assetId,
                    tweetImageUrl: url
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
        const tweetIdQuery = queryTweet(id);
        client.delete({
            query: tweetIdQuery
        })
        .catch(error => console.log(error.message))
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
                setCurrentUserTweets,
                currentUserTweets,
                setIsLoading,
                isLoading,
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
                setOtherUsers,
                otherUsers,
                setLatestNews,
                latestNews,
                isShowFollows,
                setIsShowFollows,
                setToken,
                token
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const  useStateContext = () => useContext(Context);