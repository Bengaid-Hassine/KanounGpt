from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import yagmail
import os


@api_view(['POST'])
def send_auto_email(request):
    try:
        subject = request.data["Object"]
    except KeyError:
        return Response({"error": "Missing key 'Object' in request body"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        name_reporter = request.data["Nom"]
    except KeyError:
        return Response({"error": "Missing key 'Nom' in request body"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        email_reporter = request.data["Email"]
    except KeyError:
        return Response({"error": "Missing key 'Email' in request body"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        message = request.data["Message"]
    except KeyError:
        return Response({"error": "Missing key 'Message' in request body"}, status=status.HTTP_400_BAD_REQUEST)

    
    sender = os.environ.get('SENDER_EMAIL')             

    receiver = os.environ.get('RECEIVER_EMAIL')  
     
    content = f"{name_reporter.capitalize()} (Voici son email : {email_reporter}) a envoyé le message suivant :\n\n {message}" 
    
   
    try: 
        yag = yagmail.SMTP(user=sender, password=os.environ.get('SENDER_PASSWORD'))
        yag.send(to=receiver, subject=subject, contents=content)
        return Response("Email sent successfully", status=200)
    except Exception as e:
        # Handle exceptions, such as authentication errors or SMTP server issues
        return Response(f"An error occurred while sending the email: {str(e)}", status=400)
    

        

    
