
import { useStateContext } from "../../context/StateContext";
import { News } from "../";
import { AiOutlineRight, AiOutlineSearch,  } from "react-icons/ai";
import { useState, useEffect } from "react";

const NewsOverlay = () => {

    const { latestNews, setIsNews, isNews } = useStateContext();
    const [filteredNews, setFilteredNews] = useState([]);
    const [name, setName] = useState("");

    useEffect(() => {
        if(name){
            const newsFiltered = latestNews.news.filter( news =>  news.title.toLowerCase().includes(name.toLowerCase()));
            setFilteredNews(newsFiltered)
        }else {
            setFilteredNews([])
        }
    }, [name,latestNews])
    
  return (
    <div className="news-overlay-container">
        <div className="news-overlay-contents">
            <div className="news-search-container">
                <span className="search-icon">
                    <AiOutlineSearch size={30}/>
                </span>
                <input 
                    autoComplete="off"
                    className="search-input-follow"
                    type="text" 
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <h3>Latest News</h3>
            { filteredNews?.length ? filteredNews.map((news,index) => (
                <News newz={news} key={`${news.id}_${index}`}/>
            ))
            : 
             latestNews?.news.map((news,index) => (
                <News newz={news} key={`${news.id}_${index}`}/>
            ))
            }
        </div>
        <div className="exit-news-overlay-container">
            <span 
                className="exit-news-button"
                onClick={() => setIsNews(!isNews)}
            >
                <AiOutlineRight size={40}/>
            </span>
        </div>
    </div>
  )
}

export default NewsOverlay