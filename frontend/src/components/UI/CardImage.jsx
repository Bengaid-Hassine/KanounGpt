import React from 'react'
import './CardImage.css';

// hoverDirection : top | bottom | right | left
function CardImage({image, details, title, hoverDirection}) {
 
  return (<>
    <div className={`cardImage-container ${hoverDirection} `}>
      <img className='img-thumbnail ' src={image}  width="100%" alt="img" />
      
      <div className="point-fort-details">
        <p> {details} </p>
      </div>
    </div>

    <h4 className='mt-3'> {title} </h4>
    </>
  )
}

export default CardImage
