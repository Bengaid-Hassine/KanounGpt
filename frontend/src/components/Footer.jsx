import React from 'react'
import Logo from "../assets/images/logo.png";

function Footer() {
  return ( 
    <footer className='container-fluid'>
      <div className="row align-items-center justify-content-evenly">
        <div className="col-lg-7 col-md-8 aboutUs-footer-container">
          <img src={Logo} height="80px" width="100px"  alt="logo" />
          <span>KanounGPT</span>
          <p className='mt-3'>Une plateforme dédiée à l'assistance juridique en Algérie, propulsée par une intelligence artificielle à la pointe de la technologie. Notre mission est de fournir un accès rapide, fiable et convivial à des informations juridiques précises pour les professionnels du droit ainsi que pour les citoyens algériens. Grâce à notre assistant intelligent, les utilisateurs peuvent poser des questions relatives à la législation algérienne et recevoir des réponses claires et pertinentes en un temps record.</p>
        </div>
        <div className="col-lg-3 col-md-3 connectWithUs-container">
          <h4>Retrouvez-nous </h4>
          <div className="social-icons">
            <i className="bi bi-facebook"></i> <i className="bi bi-instagram"></i> <i className="bi bi-twitter-x"></i>
          </div>
        </div>
      </div>
      <div className="row text-center mt-3">
        <p>  &copy; 2024 Tous droits réservés </p>
      </div>
    </footer>  
  )
}

export default Footer
