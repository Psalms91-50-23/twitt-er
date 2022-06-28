import Head from 'next/head';
import { Navbar, Footer } from './';
import { useRouter }  from 'next/router';
import { client } from '../lib/client';

const Layout = ({ children }) => {
  
  const router = useRouter();
  return (
    <div className={ router.pathname === "/" || router.pathname === "/signup" || router.pathname === "/login" ? "" : "layout"}
    >
      { router.pathname === "/" || router.pathname === "/signup" ||
      router.pathname === "/login" ? 
        <>
          <Head>
            <link rel="shortcut icon" href="/static/favicon.ico" /> 
            <title>Twitt-Er</title>
          </Head>
          <main className={"main-container-exception"}>
            {children}
          </main>
        </>
        : 
        <>
          <Head>
            <link rel="shortcut icon" href="/static/favicon.ico" /> 
            <title>Twitt-Er</title>
          </Head>
          <header>
            <Navbar />
          </header>
          <main className="main-container">
            {children}
          </main>
          <footer>
            <Footer />
          </footer>
        </>  
        }
      </div>   
  )
}

export const getStaticPaths = async () => {
  const query = `*[_type == "user"] {
    _id
  } 
  `
  const users = await client.fetch(query);
  const paths = users.map((user) => {
    return {
      params: {
          id: user._id
      }
    }
  })

  return {
      paths,
      fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params: { id }}) => {
  const query = `*[_type == "user" && _id =='${id}']`
  const user = await client.fetch(query);
  return {
    props: {
      user
    }
  }
}

export default Layout