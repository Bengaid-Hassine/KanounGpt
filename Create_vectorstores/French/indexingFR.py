# ********* I can run this file by entering in the terminal : 
# cd Create_vectorstores
# indexingEnv\Scripts\activate
# cd French
# Then : python indexingFR.py  
# This will create a vectorstore in : '../../backend/vectoreStores/French/Chroma'

#*******************************************************************************************************
#*******************************************************************************************************
# This file is used once (offline) when we want to create the VECTOR_STORE (Chroma Vector store) from our documents
#*******************************************************************************************************
#*******************************************************************************************************
from langchain_community.embeddings import HuggingFaceEmbeddings 
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import DirectoryLoader,PyPDFLoader, TextLoader 
from langchain.text_splitter import RecursiveCharacterTextSplitter, CharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv

import os 

load_dotenv() 

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
 

DATA_PATH = "docs_Fr/" 
VECTOR_STORE_PATH = "../../backend/vectorestores/French/chroma" 


# ***************************** Load documents from Directory ************************************************
# If the data directory contains both PDF and TXT files
def load_doc_pdf_txt(data_path):
    print("Loading documents ...")
    loader_pdf = DirectoryLoader(data_path, glob="*.pdf", loader_cls=PyPDFLoader)
    documents_pdf = loader_pdf.load()
    loader_txt = DirectoryLoader(data_path, glob="*.txt", loader_cls=TextLoader, loader_kwargs={'encoding': 'utf-8'})
    documents_txt = loader_txt.load()
    print(f"Nbr de documents (pages) chargés : {len(documents_pdf + documents_txt)}")
    return documents_pdf + documents_txt

# If the data directory contains only PDF files 
def load_doc_pdf(data_path):
    print("Loading documents ...")
    loader_pdf = DirectoryLoader(data_path, glob="*.pdf", loader_cls=PyPDFLoader)
    documents_pdf = loader_pdf.load()
    print(f"Nbr de documents (pages) chargés : {len(documents_pdf)}")
    return documents_pdf

# If the data directory contains only Txt files
def load_doc_txt(data_path):
    print("Loading documents ...")
    loader_txt = DirectoryLoader(data_path, glob="*.txt", loader_cls=TextLoader, loader_kwargs={'encoding': 'utf-8'})
    documents_txt = loader_txt.load()
    print(f"Nbr de documents (pages) chargés : {len(documents_txt)}")
    return documents_txt
#******************************************************************************************************


# Create vector store 'Chroma'
def create_VECTOR_STORE(chunk_size, chunk_overlap):    
    documents = load_doc_txt(DATA_PATH)
    
    text_splitter = CharacterTextSplitter(separator=" ", chunk_size=chunk_size, chunk_overlap=chunk_overlap, length_function=len)
    print("Splitting documents into chunks...")
    chunks = text_splitter.split_documents(documents)

    embeddings = GoogleGenerativeAIEmbeddings(model = "models/embedding-001")
    
    # save Chroma database to hard disk
    print("Creating vector store...")
    db = Chroma.from_documents(chunks, embeddings, persist_directory=VECTOR_STORE_PATH)
 


if __name__ == "__main__":
    create_VECTOR_STORE(chunk_size=1010, chunk_overlap=180) 
    
