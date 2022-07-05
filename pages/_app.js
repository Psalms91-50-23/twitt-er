import '../styles/globals.scss';
import '../styles/components/current-user.scss';
import '../styles/components/other-profile.scss';
import '../styles/components/people.scss';
import '../styles/components/icons.scss';
import "../styles/components/feed.scss";
import "../styles/components/tweethead.scss";
import "../styles/components/signup.scss";
import "../styles/components/icon.scss";
import "../styles/components/news.scss";
import "../styles/components/tooltip.scss";
import "../styles/components/userwidget.scss";
import "../styles/components/navicon.scss";
import "../styles/components/footer.scss";
import "../styles/components/follow-overlay.scss";
import "../styles/components/tweeticon.scss";
import "../styles/components/news-overlay.scss";
import { StateContext } from "../context/StateContext";
import { Layout } from '../components';
import { CookiesProvider } from "react-cookie";

function MyApp({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <StateContext>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StateContext>
    </CookiesProvider>
  )
}

export default MyApp
