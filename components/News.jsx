import { useState } from 'react';

const News = ({ newz }) => {

    const [showMore, setShowMore] = useState(false);
    const [showMoreDescription, setShowMoreDescription] = useState(false)
  return (
    <div className="news-container">
        <h4 className="news-title">{newz.title}</h4>
        
        <img 
            className="news-image"
            src={newz.urlToImage} alt="" 
        />
        <div className="news-description">
            { !showMoreDescription && (
                <>
                    <p className="news-text">{newz?.description?.slice(0,120)}...<span className="show-more" onClick={() => setShowMoreDescription(!showMoreDescription)}>show more description</span></p> 
                </>
            )
            }
            {   showMoreDescription && (
                <>
                    <p className="news-text" >{newz?.description}<span className="show-more" onClick={() => setShowMoreDescription(!showMoreDescription)}>show less description</span></p>
                </>
            )
            }
            { !showMore && (
                <>
                    <p className="news-text">{newz?.content?.slice(0,120)}...<span className="show-more" onClick={() => setShowMore(!showMore)}>show more</span></p> 
                </>
            )
            }
            { showMore && (
                <>
                    <p className="news-text" >{newz?.content}<span className="show-more" onClick={() => setShowMore(!showMore)}>show less</span></p>
                </>
            )
            }
            <p 
                className="news-link"
                onClick={() =>  window.open(newz?.url, '_blank', 'noopener,noreferrer')}
            >
                {newz.url}
            </p>  
        </div>
    </div>
  )
}

export default News