import React, { useEffect, useRef, useState } from "react";
import Button from "../components/UI/Button";
import { useNavigate } from "react-router-dom";
import PropagateLoader from "react-spinners/PropagateLoader";
import Typed from "typed.js";
import imgJuridique from "../assets/images/img_juridique2.jpg";
import imgForm from "../assets/images/img_juridique.jpg";
import CardImage from "../components/UI/CardImage";
import assistance from "../assets/images/assistance.jpg";
import disponible from "../assets/images/disponibilité.jpg";
import precision from "../assets/images/precision-fiabilite.png";
import confidentialite from "../assets/images/confidentialite.jpg";


function Accueil() {
  const element = useRef();
  useEffect(() => {
    const typed = new Typed(element.current, {
      strings: [
        "Avocat",
        "Juge",
        "Notaire",
        "Huissier",
        "Procureur",
        "Juriste",
        "Citoyen algérien",
      ],
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const override = {
    position: "absolute",
    top: "50%",
    left: "50%",
  };

  const goToChatbot = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigate("/chatbot");
    }, 2000);
  };

 
  const [contactForm, setContactForm] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: "",
  });
  
  const handleChangeInput = (e) => {
    setContactForm(prevContactForm => ({
      ...prevContactForm,
      [e.target.name]: e.target.value
    }));
  }


  
  // Send email to KanounGPT
  const [successfulEmail, setSuccessfulEmail] = useState(false);
  const [failedEmail, setFailedEmail] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/utils/sendMail/', {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Nom: contactForm.nom, 
                             Email: contactForm.email,
                             Object: contactForm.sujet,
                             Message: contactForm.message }), 
    })
      .then(async (res) => {
        if(res.ok) {//Response status:200
          const response = await res.json();
          console.log(response);
          setContactForm({
            nom: "",
            email: "",
            sujet: "",
            message: "",
          });
         setSuccessfulEmail(true);//Pour afficher une pop-up verte en haut indiquant le succès de l'envoie
        } else {//Response status:400
          const response = await res.json();
          console.log(response);
          setFailedEmail(true);
        }
        
      })
      /* .catch((err) => {
        alert(err);
      }) */;

    //console.log(contactForm);
    //alert("send email!");
  }

 //********************************************************************************************************** */
//******************************************************************************************************** */
//******************************************************************************************************** */



  return (
    <>
      {isLoading ? (
        <div className="loadingPage">
          <PropagateLoader 
            color="#0077B6"
            loading={isLoading}
            cssOverride={override}
            size={15}
          />
        </div>
      ) : (
        <div className="accueilPage-container">

          {successfulEmail && 
          <div className="alert alert-success email-success">
            <i onClick={()=>setSuccessfulEmail(false)} className="bi bi-x"></i>
            <p>Votre message est envoyé avec succès!</p>
          </div> }

          {failedEmail && 
          <div className="alert alert-danger email-failure">
            <i onClick={()=>setFailedEmail(false)} className="bi bi-x"></i>
            <p>Une erreur s'est produite lors de l'envoi du message!</p>
          </div> }

          <div className="intro-accueil-container container">
            <div className="row align-items-center justify-content-around">
              <div className="col-lg-7  intro-content-container">
                <h1>
                  Bienvenue sur <span className="dark-blue">Kanoun</span>
                  <span className="light-blue">GPT</span>{" "}
                </h1>
                <p>
                  Votre assistant juridique conçu pour fournir une assistance,
                  des conseils et des réponses à vos questions juridiques
                  concernant la loi algérienne.
                </p>
                <p>
                  Que vous soyez{" "}
                  <span className="animation" ref={element}></span>
                </p>
                <p>Notre chatbot est là pour vous aider!</p>
              </div>

              <div className="col-lg-5  intro-img-container">
                <img src={imgJuridique} alt="img-juridique" />
              </div>
            </div>
          </div>

          <div className="details-accueil-container container-fluid text-center">
            <div className="custom-shape-divider-top-1713207330">
              <svg
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z"
                  className="shape-fill"
                ></path>
              </svg>
            </div>

            <h1>KanounGPT, un assistant juridique intelligent !</h1>
            <p>
              KanounGPT est une plateforme innovante exploitant la puissance de
              l'intelligence artificielle pour simplifier la compréhension de la
              loi algérienne. Notre chatbot est minutieusement entraîné pour
              comprendre et interpréter les questions juridiques, garantissant
              des réponses précises et fiables. Alimenté par une technologie de
              traitement du langage naturel de pointe, KanounGPT est votre
              compagnon de confiance pour naviguer dans les complexités des
              affaires juridiques algériennes.
            </p>

            <div className="custom-shape-divider-bottom-1713204758">
              <svg
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                  className="shape-fill"
                ></path>
              </svg>
            </div>
          </div>
 

          <div className="parallex-container"></div>


          <div className="points-forts-container   container-fluid   text-center">
            <h1>Pourquoi choisir KanounGPT ?</h1>

            <div
              className="row justify-content-around align-items-center"
              style={{ marginTop: "120px" }}
            >
              <div className="card-point-fort col-sm-6">
                <CardImage
                  image={confidentialite}
                  details="Votre vie privée et la confidentialité sont primordiales. Interagissez avec notre chatbot en toute confidentialité"
                  title="Confidentialité"
                  hoverDirection="top"
                />
              </div>

              <div className="card-point-fort col-sm-6">
                <CardImage
                  image={assistance}
                  details="Accédez à des réponses rapides à vos questions juridiques sans avoir besoin de recherches approfondies ou de consultations"
                  title="Assistance instantanée"
                  hoverDirection="bottom"
                />
              </div>

              <div className="card-point-fort col-sm-6">
                <CardImage
                  image={precision}
                  details="Soyez assuré que les informations fournies sont précises, fiables et à jour avec la loi algérienne"
                  title="Précision et Fiabilité"
                  hoverDirection="top"
                />
              </div>
              <div className="card-point-fort col-sm-6">
                <CardImage
                  image={disponible}
                  details="Notre chatbot est disponible 24h/24 et 7j/7, fournissant une assistance chaque fois que vous en avez besoin"
                  title="Disponibilité 24/7"
                  hoverDirection="bottom"
                />
              </div>
            </div>
          </div>

          <div className="essayer-chatbot-container container-fluid text-center">
            <h1>Ne perdez plus de temps ! Passer à l'action</h1>

            <p>
              Prêt à découvrir la puissance de l'assistance juridique pilotée
              par l'IA ? Commencez à explorer KanounGPT dès aujourd'hui et
              débloquez une mine de connaissances juridiques à portée de main.
            </p>

            <div className="d-flex btn-essayer-container  mx-auto">
              <Button
                content="Essayer KanounGPT"
                className="claireNoHover"
                onClick={goToChatbot} 
                hasIcon={true}
                icon={<i className="bi bi-arrow-right"></i>}
              />
            </div>
          </div>

          <div
            id="contact"
            className="container-fluid   contact-accueil-container"
          >
            <h1>Contactez-nous</h1>
            <p>
              Vous avez des questions, des commentaires ou des suggestions ?
              N'hésitez pas à nous contacter ! Remplissez le formulaire
              ci-dessous et nous vous répondrons dans les plus brefs délais.
            </p>

            <div className="contact-form-container   container">
              <div
                className="row align-items-start justify-content-center"
                style={{ height: "100%" }}
              >
                <div className="col-md-5 img-contact-container">
                  <img src={imgForm} alt="img-juridique" />

                  <div className="coord-container">
                    <div className="social-icons">
                      <i className="bi bi-facebook"></i>{" "}
                      <i className="bi bi-instagram"></i>{" "}
                      <i className="bi bi-twitter-x"></i>
                    </div>
                  </div>
                </div>

                <div className="col-md-7 form-container">

                  <form onSubmit={sendEmail} >
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Nom complet
                      </label>
                      <input required id="name" name="nom" className="form-control" type="text" value={contactForm.nom}  onChange={(e) => handleChangeInput(e)}/>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input required id="email" name="email" className="form-control" type="email" value={contactForm.email} onChange={(e) => handleChangeInput(e)} />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="subject" className="form-label">
                        Sujet
                      </label>
                      <input required id="subject" name="sujet" className="form-control" type="text" value={contactForm.sujet} onChange={(e) => handleChangeInput(e)}/>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="subject" className="form-label">
                        Message
                      </label>
                      <textarea className="form-control" name="message" required placeholder="Entrez votre message ici..."
                      value={contactForm.message} onChange={(e) => handleChangeInput(e)} ></textarea>
                    </div>

                    <div className="mx-auto" style={{'width':'fit-content'}}>
                      <Button isSubmitBtn={true} content="Envoyer" className="monBtnClaire" />
                    </div>

                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Accueil;
