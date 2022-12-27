import { useState } from 'react';

const News = ({ newz }) => {
    const [showMoreDescription, setShowMoreDescription] = useState(false)
  return (
    <div className="news-container">
        <h5 className="news-title">{newz.name}</h5>
        { newz?.image?.thumbnail && (
            <img 
                className="news-image"
                src={newz.image.thumbnail.contentUrl} alt="" 
            />
        )
        }
        <div className="news-description">
            { !showMoreDescription && (
                <>
                    <p className="news-text">{newz?.description?.slice(0,100)}...<span className="show-more" onClick={() => setShowMoreDescription(!showMoreDescription)}>show more description</span></p> 
                </>
            )
            }
            {   showMoreDescription && (
                <>
                    <p className="news-text" >{newz?.description}<span className="show-more" onClick={() => setShowMoreDescription(!showMoreDescription)}>show less description</span></p>
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