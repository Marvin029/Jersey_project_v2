from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('create/', views.jersey_customizer, name='jersey_customizer'),
    path('pre-order/', views.pre_order, name='pre_order'),
    path('about/', views.about, name='about'),
    path('logout/', views.logout_view, name='logout'),
    path('save-design/', views.save_design, name='save_design'),
]