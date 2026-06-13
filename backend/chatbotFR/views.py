from . import RetrievalQA
from rest_framework.response import Response 
from rest_framework.decorators import api_view
from rest_framework import status



CHAIN = None # Elle doit être initialisée qu'une seule fois lors de la première requête 



@api_view(['POST']) 
def get_chatbot_response(request): 
    try:
        question = request.data["question"] 
    except KeyError:
        return Response({"error": "Missing key 'question' in request body"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        allMessages = request.data["allMessages"]
    except KeyError:
        return Response({"error": "Missing key 'allMessages' in request body"}, status=status.HTTP_400_BAD_REQUEST)

    global CHAIN
    if CHAIN is None:
        CHAIN = RetrievalQA.conversation_qa_chain(allMessages)
       
   
    response = RetrievalQA.generate_response(CHAIN, question)
    
    return Response({'answer': response})
    















































 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

#******************************** Better (rana nakhadmo biha) **************************************************************
@api_view(['POST'])
def get_chatbot_response_(request):
    try:
        question = request.data["question"]
        all_messages = request.data["allMessages"] 
    except KeyError:
        return Response({"error": "Missing key 'question' or 'allMessages' in request body"}, status=status.HTTP_400_BAD_REQUEST)

    # Convert 'allMessages' into a Python list (if it's not already a list)
    if not isinstance(all_messages, list):
        all_messages = [all_messages] 
    
    all_messages.pop(0) #Supprimer le 1er message de KanounGPT (pas important)
    
    # 2- Construire 'chat_history(les 2 dernières conversations)' à partir de 'allMessages'
    chat_history = RetrievalQA.build_chat_history(all_messages, k=2)
     
    # 3- Construire la chaîne une seule fois lors de la 1ère requête seulement (voir la chaine qui se trouve dans le fichier 
    #'MemoryRetrievalChain' (section 1-Memory manuelle) dans [MémoirePFE/KanounGPT code])
    global CHAIN
    if CHAIN is None:
        CHAIN = RetrievalQA.conversation_qa_chain_better()
        
        
    # 4- Invoquer la chaine en lui passant le chat_history construit et la question
    response = RetrievalQA.generate_response_better(CHAIN, question, chat_history)
    
    return Response({'answer': response})
    




    



