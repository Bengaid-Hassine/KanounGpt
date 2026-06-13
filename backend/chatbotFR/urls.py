from django.urls import path
from . import views
 
urlpatterns = [ 
    path("ask/", views.get_chatbot_response_),
]