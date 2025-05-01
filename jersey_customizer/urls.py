from django.urls import path
from . import views
from .views import login_view, logout_view

urlpatterns = [
    path('', views.home, name='home'),
    path('jersey_customizer/', views.jersey_customizer, name='jersey_customizer'),
    path('pre-order/', views.pre_order, name='pre_order'),
    path('about/', views.about, name='about'),
    path('logout/', views.logout_view, name='logout'),
    path('login/', login_view, name='login'),

]