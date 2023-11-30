from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('search', views.search, name='search'),
    path('selPdf',views.selPdf, name='selPdf'),
    path('getTagPdf',views.getTagPdf, name='getTagPdf'),
    path('getItemData',views.getItemData, name='getItemData'),
    path('addPdfs',views.addPdfs, name='addPdfs')
]