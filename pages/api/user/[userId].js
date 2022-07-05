import { sanityBaseURL } from "../../../lib/functions";
import { queryOtherUsers, queryUser, queryUserTweets, queryProfile } from "../../../lib/queries";

export default async function handler(req,res){

    if(req.method === "GET"){
        const { userId } = req.query;
        const userQuery = encodeURIComponent(queryUser(userId));
        const currentUser = await fetch(`${sanityBaseURL}${userQuery}`)
        .then(res => res.json())
        .catch(error => console.log(error.message));
        res.status(200).json({user: currentUser.result})
    }
}