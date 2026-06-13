/* eslint-disable default-case */

/*********************************************************************************** */
/** ATTENTION: Il faut lancer le serveur du backend (cd backend, djangoenv\Scripts\activate, python manage.py runserver)
 ***    et lancer aussi le serveur du frontend (cd frontend, npm start) */ 

import { useState, useRef, useEffect } from "react";
import { Send } from "react-feather";
import LoadingDots from "../components/UI/LoadingDots";
import assistant from "../assets/images/assistant_avatar.png";
import user from "../assets/images/user_avatar.png";



function ChatbotPage() {
  const [isDark, setIsDark] = useState(false);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([
    {
      role: "assistant",
      content:
        "Bonjour et bienvenue sur notre plateforme d'assistance juridique ! Je suis ici pour répondre à vos questions et vous aider dans vos démarches légales. Que puis-je faire pour vous aujourd'hui ?",
    },
    
  ]);

  const lastMessageRef = useRef();
  const [loading, setLoading] = useState(false);

 
  const askChatbot = () => {
    if (message === "") return;

    const newUserMsg = {
      role: "user",
      content: message.trim().replaceAll("\n", " "),
    };
    setAllMessages((prevAllMessages) => [...prevAllMessages, newUserMsg]);

    //Reset message input field
    setMessage("");

    setLoading(true);
    //get response from backend (gpt3.5-turbo api)
    fetch("http://127.0.0.1:8000/chatbotFR/ask/", {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: newUserMsg.content, allMessages: allMessages }), 
    })
      .then(async (res) => {
        const response = await res.json();
        const newAIMsg = { role: "assistant", content: response["answer"] };
        setAllMessages((prevAllMessages) => [...prevAllMessages, newAIMsg]);

        setLoading(false);
      })
      .catch((err) => {
        alert("API is expired!");
      });
  };


  useEffect(()=>{
   window.scrollTo(0,0);
  }, [])

  //scroll to bottom of chat (i.e. we scroll to the last message each time allMessages changes)
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      }); /* block: "start" | "center" | "end" */
    }
  }, [allMessages]);




  return (
    <div className={`allChatbotPage-container ${isDark? "dark-chatbot-container" : ""} `}>
      <div className="mode-sombre-claire d-flex align_items-center justify-content-end">
        <button className="btn" onClick={()=>setIsDark(prevIsDark=>!prevIsDark)} title={isDark ? "mode clair" : "mode sombre"}>  
          {isDark? <i className="bi bi-brightness-high-fill"></i> : <i className="bi bi-moon-fill"></i>}
        </button>
      </div>

      <div className="h-100 d-flex">
        <div className="chatbot-container">
          <h1 data-text="Assistant juridique" className="mb-4">
            Assistant juridique
          </h1>

          <form
            className={`col-lg-10 mx-auto ${isDark? "dark-chatbot-form" : ""} `}
            onSubmit={(e) => {
              e.preventDefault();
              askChatbot();
            }}
          >
            <div className="allMsg-container" id="scrollable-messages">
              {allMessages.map((message, idx) => {
                //Search lastMessage to scroll to it
                const isLastMessage = idx === allMessages.length - 1 && idx !== 0;

                switch (message.role) {
                  case "assistant":
                    return (
                      <div
                        key={idx}
                        ref={isLastMessage ? lastMessageRef : null}
                        className="assistant-container mb-2 row align-items-start justify-content-center"
                      >
                        <div className="img-assistant-container">
                          <img
                            src={assistant}
                            className="rounded-circle"
                            height="48px"
                            width="56px"
                            alt="assistant-avatar"
                          />
                        </div>

                        <div className="col-10 text-assistant-container">
                          <h6 className="mb-2">KanounGPT</h6>
                          <p>{message.content}</p>
                        </div>
                      </div>
                    );
                  case "user":
                    return (
                      <div
                        key={idx}
                        ref={isLastMessage ? lastMessageRef : null}
                        className="user-container mb-2 row align-items-start justify-content-end"
                        style={{ width: "100%" }}
                      >
                        <div className="text-user-container">
                          {" "}
                          <h6 className="mb-2">Vous</h6>
                          <p>{message.content}</p>
                        </div>

                        <div className="img-user-container">
                          <img
                            src={user}
                            className="rounded-circle"
                            height="48px"
                            width="56px"
                            alt="user-avatar"
                          />
                        </div>
                      </div>
                    );
                    default : return null
                }
              })}
              {loading && (
                <div
                  ref={lastMessageRef}
                  className="assistant-container mb-2 row align-items-start justify-content-center"
                >
                  <div className="img-assistant-container">
                    <img
                      src={assistant}
                      className="rounded-circle"
                      height="48px"
                      width="56px"
                      alt="assistant-avatar"
                    />
                  </div>

                  <div className="col-10 text-assistant-container">
                    <h6 className="mb-4">KanounGPT</h6>
                    <LoadingDots />
                  </div>
                </div>
              )}
            </div>

            {/* input area */}
            <div className="input-container">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Entrez votre message..."
                className={`form-control ${isDark? "input-chatbot-dark" : ""} `}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    // If the Enter key is pressed without Shift
                    e.preventDefault();
                    askChatbot();
                  }
                }}
              />
              <button
                className="send-question rounded-circle"
                type="submit"
                disabled={!message || loading}
              >
                <Send
                  color={!message || loading ? "gray" : "#0077b6"}
                  size={32}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default ChatbotPage;
