
import homeStyles from '../styles/Home.module.scss';
import backgroundStyles from '../styles/module/Background.module.scss';
import { useEffect, useState } from 'react';
import { TwitterBird, BirdieHands } from '../components';
import { MdLogin, MdCreate } from 'react-icons/md';
import { useRouter } from 'next/router';
import { client } from '../lib/client';
import { useStateContext } from '../context/StateContext';

const home = ({users}) => {

  const router = useRouter();
  const { setAllUsers } = useStateContext();

  useEffect(() => {
    setAllUsers(users)
  }, [])

  return (
    <div className={backgroundStyles.container_cloud_bg}>
      <div className={backgroundStyles.twitter_bird_bg}>
        <TwitterBird />
        <div className={homeStyles.home_contents}>
          <BirdieHands />
          <div className={homeStyles.home_header_title}>
            <div 
              className={homeStyles.twitter_icon_left}
            >
            </div>
            <h1>Twitt Er</h1>
            <div 
              className={homeStyles.twitter_icon_right}
            >
            </div>
          </div>
          <div className={homeStyles.home_registered_container}>
            <h3 className={homeStyles.title}>Login</h3>
            <button 
              className={homeStyles.btn}
              onClick={() => router.push("/login")}
            >
              <span className={homeStyles.icon}>
                <MdLogin size={18}/>
              </span>
              Login User
            </button>
          </div>
          <div className={homeStyles.home_create_container}>
            <h3 className={homeStyles.title}>Not registered?</h3>
            <button 
              onClick={() => router.push("/signup")}
              className={homeStyles.btn} 
            >
              <span className={homeStyles.icon}>
                <MdCreate size={18}/>
              </span>
              Signup User
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({req,res}) => {

  if(req.cookies?.token){
      return {
          redirect: {
            destination: "/home",
            permanent: false
          }
      }
  }

  const userQuery = `*[_type == "user"]`
  const users = await client.fetch(userQuery);

  return {
    props: {
      users
    }
  }

}

export default home;