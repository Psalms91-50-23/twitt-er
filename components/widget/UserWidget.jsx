import { News } from "../index";
import { useState, useEffect } from "react";
import {  AiOutlineSearch } from "react-icons/ai";

const UserWidget = ({ news }) => {

  const [filteredNews, setFilteredNews] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
      if(name){
          const newsFiltered = news.filter( news =>  news.title.toLowerCase().includes(name.toLowerCase()));
          setFilteredNews(newsFiltered)
      }else {
          setFilteredNews([])
      }
  }, [name,news, setFilteredNews])

  // console.log({news})
  return (
    <div className="user-widget-container">
      <div className="user-widget-search-container">
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
      <div className="user-widget-news-container">
        <h1>Latest News</h1>
        { filteredNews?.length ? filteredNews.map((newz, index) => (
          <News 
            newz={newz}
            key={`${newz.id}_${index}`}
          />
        ))
        : news.map((newz, index) => (
          <News 
            newz={newz}
            key={`${newz.id}_${index}`}
          />
        ))
        }

      </div>
    </div>
  )
}

export default UserWidget