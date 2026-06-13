import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import Logo from "../assets/images/logo.png";
import Expand from "../assets/svgIcons/menu.svg";
import Close from "../assets/svgIcons/close.svg";

function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <header>
     
      <nav className="navbar navbar-expand-lg ">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={Logo} alt="KanounGPT" width="50" height="40" className="d-inline-block align-text-center" />
            <span className="ms-2">KanounGPT</span>
          </Link>

          <div
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={()=>setIsExpanded(prevIsExpanded=> !prevIsExpanded)}
          >
            <img src={ isExpanded? Close : Expand} height="32" width="40" alt="" />
          </div>  
          
          

          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Accueil
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/chatbot">
                  Chatbot
                </NavLink>
              </li>
              <li className="nav-item">
                <HashLink className="nav-link" to="/#contact">
                  Contact
                </HashLink>
              </li>
            </ul>
          </div>

        </div>
      </nav>
    </header>
  );
}

export default Navbar;
