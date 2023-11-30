from django.http import JsonResponse
from django.http import HttpResponse

from django.views.decorators.csrf import csrf_exempt
import difflib
import os
import json
import base64
import re

from django.shortcuts import render

from src.extractionProcess import DataExtraction
from src.pdfEditor import PDFGen
from src.tagData import tagData
#pass DataExtraction the name of the file (not the path)
#RUNNING THIS WILL ALL EXTRACTED IMAges

def search_closest_words(word, word_list):
    closest_words = difflib.get_close_matches(word.lower(), word_list, n=10)
    return closest_words




def load_list():
    global artcraft_list
    artcraft_list = []
    _file_list = os.listdir('src/Artcraft')
    #get all files from image folder path
    for file in _file_list:
        artcraft_list.append(file.lower())

load_list()
@csrf_exempt 
def index(request):
    x = json.loads(request.body.decode('utf-8'))
    empty = ['','','','','']
    if(len(x) == 1):
        m = PDFGen(x[0],empty,empty,empty)
        m.run_all()
    if(len(x) == 2):
        m = PDFGen(x[0],x[1],empty,empty)
        m.run_all()
    if(len(x) == 3):
        m = PDFGen(x[0],x[1],x[2],empty)
        m.run_all()
    if(len(x) == 4):
        m = PDFGen(x[0],x[1],x[2],x[3])
        m.run_all()
        #remove images from Extracted Images
    _file_list = os.listdir('src/ExtractedImages/')
    for _file_name in _file_list:
        _file_path = os.path.join('src/ExtractedImages/', _file_name)
        os.remove(_file_path)
        return  HttpResponse('WEHO')
# Create your views here.
@csrf_exempt 
def search(request):
    decoded_data = request.body.decode('utf-8')
    json_data = json.loads(decoded_data)
    words = search_closest_words(json_data['data'],artcraft_list)
    word_dict = {}
    for word in words:
        word_dict[word] = None
    if(len(word_dict) > 0):

        return JsonResponse(word_dict)
    return HttpResponse(None)
@csrf_exempt 
def selPdf(request):
    x = json.loads(request.body.decode('utf-8'))    
    src_dir = 'src/Artcraft/'
    list = []
    
        
    with open(src_dir + x[1], "rb") as pdf_file:
        pdf_bytes = pdf_file.read()
            
        my_base64 = base64.b64encode(pdf_bytes).decode('utf-8') 
        pdf_dict = {
            "data":my_base64,
            "index":x[0],
            "filename":x[1]
        }
        list.append(pdf_dict) 
    data = json.dumps(list)
    if(not data):
        return HttpResponse(None)
    else:
        return HttpResponse(data, content_type='application/json')
@csrf_exempt 
def getTagPdf(request):
    x = json.loads(request.body.decode('utf-8'))
    empty = ['','','','','','','']
    if(len(x) == 1):
        m = PDFGen(x[0],empty,empty,empty)
        m.run_all()
    if(len(x) == 2):
        m = PDFGen(x[0],x[1],empty,empty)
        m.run_all()
    if(len(x) == 3):
        m = PDFGen(x[0],x[1],x[2],empty)
        m.run_all()
    if(len(x) == 4):
        m = PDFGen(x[0],x[1],x[2],x[3])
        m.run_all()
        #remove images from Extracted Images
    _file_list = os.listdir('src/ExtractedImages/')
    for _file_name in _file_list:
        _file_path = os.path.join('src/ExtractedImages/', _file_name)
        os.remove(_file_path)
    list = []
    with open('src/modified.pdf', "rb") as pdf_file:
        pdf_bytes = pdf_file.read()
    my_base64 = base64.b64encode(pdf_bytes).decode('utf-8') 
    pdf_dict = {
            "data":my_base64,
            "index":0,
            "filename":'modified.pdf'
        }
    list.append(pdf_dict)
    data = json.dumps(list)
    return HttpResponse(data, content_type='application/json')


@csrf_exempt 
def getItemData(request):
    x = json.loads(request.body.decode('utf-8'))
    if(len(x) == 0):
        return JsonResponse(None)

    empty = ['','','']
    
    print(x)
    de = DataExtraction(x[1])
    de.run_all()
    
    tD = tagData(x[1])
    a = tD.getFromJson()
    print(a)
    _m_list = [x[0]]
    for x in a:
        _t_dict = {
            'item_code': x[0],
            'size': x[1],
            'bulbs':x[2],
            'detailsFirst':x[3],
            'detailsSecond':x[4],
            'detailsThird':x[5],
        }
        _m_list.append(_t_dict)
    print( _m_list)


    return JsonResponse(_m_list,safe=False)

@csrf_exempt 
def addPdfs(request):
    if request.method == 'POST':
        for filename, pdf_file in request.FILES.items():
            # Check if the file already exists in the Artcraft directory
            if os.path.isfile('src/Artcraft/' + filename):
                print('file already exists')
                continue

            # Remove any blank spaces from the filename
            filename = filename.replace(' ', '')

            # Check if the filename contains "-Spec-Sheet" and modify it accordingly
            if "-Spec-Sheet" in filename:
                new_filename = filename.replace("-Spec-Sheet", "")
            else:
                new_filename = filename

            # Save the file to the Artcraft directory with the modified filename
            with open('src/Artcraft/' + new_filename, 'wb+') as destination:
                for chunk in pdf_file.chunks():
                    destination.write(chunk)
        load_list()
        # Optionally, you can return a response to the user indicating that the files were uploaded successfully
        return HttpResponse('Files uploaded successfully.')
    else:
        # Render the form for the user to upload a file
        return render(request, 'upload_pdf.html')