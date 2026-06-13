import React from 'react'
import './Button.css';

//className = "monBtnClaire" et je peux créer d'autres classes (small buttons, dark buttons...)
function Button({isSubmitBtn, content, className, onClick, disabled, hasIcon, icon}) {
  return ( 
    <button type={isSubmitBtn? 'submit' : ''} className={`btn ${className}`} onClick={onClick} disabled={disabled}>
      {content}
      {hasIcon ? icon : null}
    </button>
  )
}

export default Button
