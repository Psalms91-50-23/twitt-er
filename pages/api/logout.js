import cookie from "cookie";

export default async function logout(req,res){
    if(req.method === "POST"){
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("token", "" , {
                //if set httpOnly cannot access cookie from client side, it embeds the cookie to the header 
                // httpOnly: true,
                secure: false,
                // secure: process.env.NODE_ENV !== "development",
                expires: new Date(0),
                // sameSite: "none",
                path: "/"
            })
        )
        res.statusCode = 200;
        res.json({ success: true })
    }
}