import { sanityBaseURL } from "../../../../lib/functions";
import { queryOtherUsers, queryUser, queryProfile } from "../../../../lib/queries";

export default async function handler(req, res) {

    if(req.method === "GET"){
        const { userId } = req.query;
        const userQuery = encodeURIComponent(queryUser(userId));
        const otherUsersQuery = encodeURIComponent(queryOtherUsers(userId));
        const profileQuery = encodeURIComponent(queryProfile(userId));

        try {
            const results = await Promise.all([
                fetch(`${sanityBaseURL}${userQuery}`),
                fetch(`${sanityBaseURL}${otherUsersQuery}`),
                fetch(`${sanityBaseURL}${profileQuery}`)
            ]);
            const finalData = await Promise.all(results.map(result => result.json()));
            res.status(200).json({ 
                user: finalData[0].result,
                otherUsers: finalData[1].result,
                profile: finalData[2].result
            });
        }catch(error){
            console.log(error.message);
        }
    }
}   