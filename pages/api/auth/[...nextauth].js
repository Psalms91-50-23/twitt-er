import NextAuth from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
// import Provider from "next-auth/providers"
import  CredentialsProvider  from "next-auth/providers/credentials";
import { client } from "../../../lib/client";
import { findUser, decodePassword  } from "../../../lib/functions";

// import sanityClient from '@sanity/client';
// import imageUrlBuilder from '@sanity/image-url';

// export const client = sanityClient({
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//   dataset: 'development',
//   apiVersion: '2022-05-10',
//   useCdn: true,
//   token: process.env.NEXT_PUBLIC_SANITY_TOKEN
// });


const options = {
    providers: [
        CredentialsProvider({
            // name: "credentials",
            // credentials: {
            //     userName: {
            //         label: "Email",
            //         type: "text",
            //         placeholder: "test123@gmail.com"
            //     },
            //     password: { label: "Password", type: "password", placeholder: "Password" },
            // },
            authorize: (credentials) => {
                const userQuery = `*[_type == "user" && userName == '${credentials.userName}']`;
                const userFound = client.fetch(userQuery);
                const { _id, userName, password, passwordEncodedPattern, imageUrl, profileImage } = userFound;
                let userImage;
                if(profileImage?.asset){
                    userImage = profileImage.asset._ref;
                }
                // const userFound = findUser(users, credentials.userName);
                // console.log({userFound});
                const pwDecoded = decodePassword(userFound.passwordEncodedPattern, userFound.password);
                if(credentials.userName === userFound.userName 
                    && credentials.password === userFound.pwDecoded){
                    return {
                        id: _id,
                        userName,
                        imageUrl,
                        imageProfile: userImage
                    }
                }
                // if fails
                return null;
            }
        })
    ],
    // adapter: SanityAdapter(client),
    pages: {
        signIn: "/login",
      },
    secret: process.env.NEXT_PUBLIC_SECRET,
    callbacks: {
        async signIn({ username, userpassword }) {
        console.log({username});
        console.log({userpassword});
        const userQuery = `*[_type == "user" && userName == '${credentials.userName}']`;
        const userFound = client.fetch(userQuery);
        // const { _id, userName, password, passwordEncodedPattern, imageUrl, profileImage } = userFound;
        let userImage;
        if(userFound.profileImage?.asset){
            userImage = profileImage.asset._ref;
        }
        // const userFound = findUser(users, credentials.userName);
        // console.log({userFound});
        const pwDecoded = decodePassword(userFound.passwordEncodedPattern, userFound.password);
        if(username === userFound.userName 
            && userpassword === userFound.pwDecoded){
            // return {
            //     id: _id,
            //     userName,
            //     imageUrl,
            //     imageProfile: userImage
            // }
            return "/home"
        }
        else {
            return "/api/auth/signin";
        }

        // if(){

        //     return "/home";
        // }
        
        },
        jwt: ({token, user}) => {
            if(user){
                token.id = user.id
            }
            return token
        },
        session: ({ token, session }) => {
            if(token){
                session.id = token.id;
            }
            return session
        }
    },
    jwt: {
        secret: process.env.NEXT_PUBLIC_SECRET,
        encryption: true
    }
}

export default NextAuth(options);