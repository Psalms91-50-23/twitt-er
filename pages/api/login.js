import cookie from "cookie";

export default async function login(req,res) {
    if(req.method === "POST"){
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("token", req.body.token , {
                // httpOnly: false,
                secure: false,
                maxAge: 60*60*24,
                sameSite: "none",
                path: "/"
            })
        )
        res.statusCode = 200;
        res.json({ success: true , token: req.body.token })
    }
}