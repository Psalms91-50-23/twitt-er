import { News } from "../index";
import { useState, useEffect } from "react";
import {  AiOutlineSearch } from "react-icons/ai";

const UserWidget = ({ news }) => {

  const [filteredNews, setFilteredNews] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
      if(search){
          const newsFiltered = news.filter( news =>  news.name.toLowerCase().includes(search.toLowerCase()));
          setFilteredNews(newsFiltered)
      }else {
          setFilteredNews([])
      }
  }, [search,news, setFilteredNews])


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
            name="search"
            placeholder="Filter by title"
            onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="user-widget-news-container">
        <h2>Latest News</h2>
        { filteredNews?.length ? filteredNews.map((newz, index) => (
          <News 
            newz={newz}
            key={`${newz._type}_${index}`}
          />
        ))
        : news.map((newz, index) => (
          <News 
            newz={newz}
            key={`${newz._type}_${index}`}
          />
        ))
        }

      </div>
    </div>
  )
}

export default UserWidget