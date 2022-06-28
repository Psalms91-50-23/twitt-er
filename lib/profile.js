import React from 'react';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import Image from 'next/image';
import { client } from './client';
// user: { _id, imageUrl, userName, 
// profileImage: { asset: { _ref}} } }

const dashboard = ({ 
  token, user: { _id, imageUrl, userName, 
  profileImage }}) => {
  // console.log({user});
  console.log({profileImage});
  console.log({token});
  return (
    <div>
      <h2>username: {userName}</h2>
      <h3>
        route /profile in home structure folder structure
      </h3>
      {/* <Image src={profileImage.asset._ref}/> */}
      <span>{token}</span>
      <span>user id:  {_id}</span>
      </div>
  )
}

export const getServerSideProps = async({ req, res }) => {

  if(!req.cookies.token){
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  // const cookieExists = Cookie.get("token");
  console.log("profile");
  // console.log({cookieExists});
  console.log(req.cookies.token)
  let userId;
  if(req.cookies.token){
    userId = req.cookies.token.split(process.env.NEXT_PUBLIC_SECRET)[0];
    // userId = cookieExists.split(process.env.NEXT_PUBLIC_SECRET)[0];
  }
  console.log({userId});
  const query = `*[_type == "user" && _id =='${userId}']`
  const user = await client.fetch(query);

  return {
    props: { 
        token: req.cookies.token && req.cookies.token,
        user
    }
  }

}

export default dashboard