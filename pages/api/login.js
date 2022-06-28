import cookie from "cookie";


export default (req,res) => {
    if(req.method === "POST"){
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("token", req.body.token , {
                // httpOnly: true,
                secure: false,
                maxAge: 60*60*3,
                // sameSite: strict,
                path: "/"
            })
        )
        res.statusCode = 200;
        res.json({ success: true , token: req.body.token })
    }
}