from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import Chroma
from langchain import HuggingFaceHub 
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferWindowMemory
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import re 
import os



load_dotenv() # This line brings all environment variables from .env into os.environ

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY') # For using Gemini pro Embeddings


VECTOR_STORE_PATH = "../vectorstores/French/chroma" 

 


def set_custom_prompt():
    template_memory = """
    You are KanounGpt. You are an intelligent legal assistant that can perform a respectful conversation with a Human.
    Answer in French only without saying any word in English. If you don't know the answer, please just say that you don't know.
    You don't say anything harmful, nor toxic nor illegal. 

    If the question is unrelated to legal matters, express that you're unable to provide assistance and clarify that you specialize as a legal assistant.

    Answer the question as detailed as possible from the provided context and chat history, make sure to provide all the details

    Context: {context}
    Chat History: {chat_history}
    Question: {question}

    Answer :
    """

    prompt = PromptTemplate(
    template=template_memory, input_variables=["context", "question"]
    )
    return prompt



def load_llm(repo_id) : 
    llm = HuggingFaceHub(
                        repo_id= repo_id, 
                        model_kwargs={ 'temperature':0.01, 
                                        "do_sample": True,
                                        "max_new_tokens":320 # max_new_tokens : nbr de tokens générés en response
                                        }, 
                        verbose=False)
    return llm 



def conversation_qa_chain(allMessages):
    llm = load_llm("mistralai/Mistral-7B-Instruct-v0.2")
    
    embeddings = GoogleGenerativeAIEmbeddings(model = "models/embedding-001")
    
    # load Chroma vector store from hard disk
    db = Chroma(persist_directory=VECTOR_STORE_PATH, embedding_function=embeddings)
    
    prompt = set_custom_prompt()
    
    # Create and Store chat history
    memory = ConversationBufferWindowMemory(allMessages, k=2, memory_key="chat_history", return_messages=True) #k=2: store only the last 2 conversations
    
    qa_chain = ConversationalRetrievalChain.from_llm(
        llm=llm, 
        retriever=db.as_retriever(search_type="similarity", search_kwargs={"k": 3}), #return 3 relevant documents (context) 
        memory=memory,
        return_source_documents= False,
        combine_docs_chain_kwargs={"prompt": prompt},
        verbose=False
    ) 
    return qa_chain




def process_response(response): 
    """Extracts the text between the first occurrence of 'Answer :' and 'Question:' OR between the first occurrence of 'Answer :' and 'Answer:'"""
    pattern = r"(Answer :)(.+?)(?=Question:|\bAnswer\b|\bHuman\b)"
    match = re.search(pattern, response['answer'], re.DOTALL)
    
    # Extract the text if found
    if match:
        return match.group(2).strip()  
    
    else:
        #There is no 'Question :' or 'Answer :' after the first occurence of 'Answer :'
        """Extracts the text starting from 'Answer :' until the end""" 
        match = re.search(r"Answer :(.+)", response['answer'], re.DOTALL)
        return match.group(1).strip()




def generate_response(chain, question):
    
    if question.strip().lower().startswith("bonjour") or ' bonjour' in question.strip().lower():
       return "Bonjour, comment puis-je vous aider en tant qu'assistant juridique?"
   
    elif question.strip().lower().startswith("bonsoir") or ' bonsoir' in question.strip().lower():
       return "Bonsoir, comment puis-je vous aider en tant qu'assistant juridique?"
   
    elif question.strip().lower().startswith("merci") or ' merci' in question.strip().lower():
       return "De rien ! Si vous avez besoin d'aide supplémentaire, n'hésitez pas à me demander."
   
    elif question.strip().lower().startswith("au revoir") or ' au revoir' in question.strip().lower():
       return "Au revoir ! Passez une excellente journée !"
   
    else:
        response = chain.invoke({"question": question})
        return process_response(response) 




















































































#********************************* Better (rana nakhdmo biha) ************************************************************************
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain.chains import create_retrieval_chain
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_openai import ChatOpenAI, OpenAIEmbeddings


def set_custom_prompt_better():
    
    template_memory = """
    You are KanounGpt. You are an intelligent legal assistant that can perform a respectful conversation with a Human.
    Answer in French only without saying any word in English. If you don't know the answer, please just say that you don't know.
    You don't say anything harmful, nor toxic nor illegal.

    You answer only questions related to Algerian Law.
    Answer the question from the provided context. 

    Context: {context}
    """
    
    prompt = ChatPromptTemplate.from_messages([
        ("system" , template_memory ),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "Question: {input}"),
        ("system", "Answer : ")
    ])
    return prompt




def load_llm_better():
    llm = ChatOpenAI(model_name="gpt-4-turbo", temperature=0.0, max_tokens=380)
    return llm


def conversation_qa_chain_better():
    
    llm = load_llm_better()
    #llm = load_llm("mistralai/Mistral-7B-Instruct-v0.2") 
    
    embeddings = GoogleGenerativeAIEmbeddings(model = "models/embedding-001") #chroma et chroma2
    
    # load Chroma vector store from hard disk
    db = Chroma(persist_directory=VECTOR_STORE_PATH, embedding_function=embeddings)
    
    prompt = set_custom_prompt_better() 
    
    retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 3}) 
    
    #********************************************************************************************************
    #********************************** DEBUGGING **********************************************************************
    #a = [doc.page_content for doc in retriever.get_relevant_documents("Quelles sont les lois qui protègent l'employé dans son milieu de travail?")]
    #print(f"\n\n\n\n Context : {a}")
    #********************************************************************************************************
    #********************************************************************************************************
    
    
    #(ajuster la requête envoyée au VectorStore en fonction du chat_history et la dernière question de l'user) *************************************************
    retriever_prompt = ChatPromptTemplate.from_messages([ 
        MessagesPlaceholder(variable_name='chat_history'),
        ("human", "{input}"),
        ("human", "Given the above conversation, generate a search query to look up in order to get information relevent to the conversation")
    ])
    history_aware_retriever = create_history_aware_retriever(llm=llm, retriever=retriever, prompt=retriever_prompt)
    #***************************************************************************************************************

    qa_chain = create_retrieval_chain(
        #history_aware_retriever, 
        retriever,
        create_stuff_documents_chain(llm=llm, prompt=prompt)  
    )
    return qa_chain



def build_chat_history(all_messages, k=2): # k : nbr des dernières interactions à sauvegarder dans chat_history  
    # 1 intéraction ---> (user:..., KanounGPT:..)
    if len(all_messages) <= k*2 :
        chat_history = [HumanMessage(content=msg['content']) if msg['role']=="user" else AIMessage(content=msg['content']) for msg in all_messages]
        
    else:
        last = len(all_messages)
        chat_history = [HumanMessage(content=msg['content']) if msg['role']=="user" else AIMessage(content=msg['content']) for msg in all_messages[last-(k*2) : last]]
    
    return chat_history


    

def generate_response_better(chain, question, chat_history):
    
    if question.strip().lower().startswith("bonjour") or ' bonjour' in question.strip().lower():
       return "Bonjour, comment puis-je vous aider en tant qu'assistant juridique?"
   
    elif question.strip().lower().startswith("bonsoir") or ' bonsoir' in question.strip().lower():
       return "Bonsoir, comment puis-je vous aider en tant qu'assistant juridique?"
   
    elif question.strip().lower().startswith("merci") or ' merci' in question.strip().lower():
       return "De rien ! Si vous avez besoin d'aide supplémentaire, n'hésitez pas à me demander."
   
    elif question.strip().lower().startswith("au revoir") or ' au revoir' in question.strip().lower():
       return "Au revoir ! Passez une excellente journée !"
   
    else:
        response = chain.invoke({"input": question, "chat_history": chat_history})
        # ********************* DEBUGGING ***************************************
        # print(f"\n\n\n\n\nresponse: {response}")
        return response['answer']
        

    