import { sanityBaseURL } from "../../../lib/functions";
import { queryOtherUsers, queryUser, queryUserTweets, queryProfile } from "../../../lib/queries";

export default async function handler(req,res){
    if(req.method == "POST"){
        const { userId } = req.query;
        const userQuery = encodeURIComponent(queryUser(userId));
        const otherUsersQuery = encodeURIComponent(queryOtherUsers(userId));
        // const otherUsersQuery = encodeURIComponent(queryOtherUsers(req.body.userId));
        const profileQuery = encodeURIComponent(queryProfile(userId));
        const userTweetsQuery = encodeURIComponent(queryUserTweets(userId));

        try{
            const results = await Promise.all([
                fetch(`${sanityBaseURL}${userTweetsQuery}`),
                fetch(`${sanityBaseURL}${profileQuery}`),
                fetch(`${sanityBaseURL}${userQuery}`),
                fetch(`${sanityBaseURL}${otherUsersQuery}`),
            ])
            const finalData = await Promise.all(results.map(result => result.json()));
            res.status(200).json({
                userTweets: finalData[0].result,
                profile: finalData[1].result,
                user: finalData[2].result,
                otherUsers: finalData[3].result,
            });
        }catch(error){
            console.log(error.message);
        }

    }
}