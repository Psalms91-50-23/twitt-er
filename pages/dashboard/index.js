import React, { useEffect } from 'react';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import Image from 'next/image';
import { client, urlFor } from '../../lib/client';
import { useStateContext } from '../../context/StateContext';
import { Sidebar, Feed, FeedWidget } from '../../components';

const dashboard = ({ token, foundUser }) => {
    
  const { _id, userName, imageUrl, profileImage } = foundUser;
  const { user, setUser } = useStateContext();
  useEffect(() =>{
    setUser({_id, userName, imageUrl, profileImage })
  },[]) 

  return (
    <div className="dashboard-container">
      <Sidebar userDetails={foundUser[0]}/>
      <Feed />
      <FeedWidget />
      {/* <h2>username: {foundUser[0].userName}</h2>
      <h3>
        route /profile in home structure folder structure
      </h3>
      { foundUser[0]?.profileImage?.asset && (
        <img 
          src={urlFor(foundUser[0].profileImage?.asset?._ref)} 
          // alt={name} 
          width={250}
          height={250}
        /> 
        )
      }
      { foundUser[0]?.imageUrl && (
        <img 
          src={foundUser[0].imageUrl} 
          // alt={name} 
          width={250}
          height={250}
        /> 
        )
      }
      <span>{token}</span>
      <span>user id:  {foundUser[0]._id}</span> */}
      </div>
  )
}

export const getServerSideProps = async({ req, res }) => {

  if(!req.cookies.token){
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    }
  }
  let userId;
  if(req.cookies.token){
    userId = req.cookies.token.split(process.env.NEXT_PUBLIC_SECRET)[0];

  }
  const query = `*[_type == "user" && _id =='${userId}']`
  const foundUser = await client.fetch(query);
  return {
    props: { 
        token: req.cookies.token && req.cookies.token,
        foundUser: foundUser? foundUser : null ,
    }
  }

}

export default dashboard