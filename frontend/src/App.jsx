import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';

import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Accueil from "./pages/Accueil";
import ChatbotPage from "./pages/ChatbotPage";
import ErrorPage from "./pages/ErrorPage";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      
      <Navbar></Navbar>
    
      <div className="App-container"> 
        <main>
          <Routes>
            <Route path="/" element={<Accueil />}></Route>

            <Route path="/chatbot" element={<ChatbotPage />}></Route>

            <Route path="*" element={<ErrorPage />}></Route>
          </Routes>
        </main>
      </div>

      <Footer></Footer>
    </>
  );
}

export default App;
