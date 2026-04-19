from django.urls import path
from . import views

urlpatterns = [
    path('', views.museu_view, name='museu')
]