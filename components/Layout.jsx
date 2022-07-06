import Head from 'next/head';
import { Navbar, Footer } from './';
import { useRouter }  from 'next/router';

const Layout = ({ children }) => {
  
  const router = useRouter();
  return (
    <div className={ router.pathname === "/" || router.pathname === "/signup" || router.pathname === "/login" ? "" : "layout"}
    >
      { router.pathname === "/" || router.pathname === "/signup" ||
      router.pathname === "/login" ? 
        <>
          <Head>
            <link rel="shortcut icon" href="/favicon.ico" /> 
            <title>Twitt-Er</title>
          </Head>
          <main className={"main-container-exception"}>
            {children}
          </main>
        </>
        : 
        <>
          <Head>
            <link rel="shortcut icon" href="/favicon.ico" /> 
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
export default Layout