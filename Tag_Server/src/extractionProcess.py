import os
from nanonets import NANONETSOCR
from PIL import Image as PILImage
import json
from pdf2image import convert_from_path
import re
import time
#Step 1. Determine file type.
#
class DataExtraction:
    def __init__(self,_file_name):
        self.file_path ='src/Artcraft/' + _file_name
        self.file_name = os.path.splitext(_file_name)[0]
        self.file_type = None
        self.image_folder_path = 'src/ExtractedImages/'
        self.json_folder_path = 'src/ExtractedJson/'
        self.my_dict = {}
        self.model = NANONETSOCR()
        self.model.set_token('a622542d-bd64-11ed-9ac0-56bb5ee4c5b0')
        
    def get_file_type(self):
        #get file type
        _file_name, self.file_type = os.path.splitext(self.file_path)    
        
    def convert_to_img(self):
        #create an empty list to store the image names
        self.image_names = []
        
        #convert PDF to JPG
        if(self.file_type == '.pdf'):
            pages = convert_from_path(self.file_path)
            for i, page in enumerate(pages):
                image_name = f'{self.file_name}-page{i}.jpg'
                page.save(f'{self.image_folder_path}{image_name}', 'JPEG')
                #append the image name to the list
                self.image_names.append(image_name)
                
        #convert PNG to JPG
        if(self.file_type == '.png'):
            image_name = f'{self.file_name}-page0.jpg'
            with PILImage.open(self.file_path) as img:
                rgb_img = img.convert('RGB')
                rgb_img.save(f'{self.image_folder_path}{image_name}')
            #append the image name to the list
            self.image_names.append(image_name)
            
        if(self.file_type == '.jpg'):
            image_name = f'{self.file_name}-page0.jpg'
            with PILImage.open(self.file_path) as img:
                rgb_img = img.convert('RGB')
                rgb_img.save(f'{self.image_folder_path}{image_name}')
            #append the image name to the list
            self.image_names.append(image_name)
    
    def extract_data(self, image_names=None):
        if image_names is None:
            #if image_names is not provided, extract data from all images in the folder
            _file_list = os.listdir(self.image_folder_path)
        else:
            #if image_names is provided, extract data only from the images in the list
            _file_list = image_names

        for file in _file_list:
            _image_path = os.path.join(self.image_folder_path, file)
            if os.path.isfile(_image_path):
                _tablesData = self.model.convert_to_tables(_image_path)
                _tables = _tablesData[0]['prediction']
                _key = None
                _val = None
                _text = None
             
                for t in _tables:
                    if 'cells' in t:
                        for cell in t['cells']:
                            _text = cell['text']
                            if(_key==None):
                                _key = self.remove_unicode_chars(_text)
                            else:
                                _val = self.remove_unicode_chars(_text)
                                if(_key and _val):
                                    self.my_dict[_key] = _val
                                _key = None  
                    
                
    def remove_unicode_chars(self,input_string):
        # Use a regular expression to match any non-ASCII characters
        nonascii_pattern = re.compile(r'[^\x00-\x7F]+')
        # Replace all non-ASCII characters with an empty string
        cleaned_string = nonascii_pattern.sub('', input_string)
        return cleaned_string

    def save_as_json(self):   
     
        file_path = self.json_folder_path + self.file_name + '.json'
        if os.path.isfile(file_path):
            with open(file_path, 'r') as f:
                existing_data = json.load(f)
        else:
            existing_data = {}

        # add new data to existing data
        existing_data.update(self.my_dict)

        # write updated data to file
        with open(file_path, 'w') as f:
            json.dump(existing_data, f, indent=8, sort_keys=True)

        # clear my_dict
        self.my_dict.clear()
    def run_all(self):
        self.get_file_type()
        self.convert_to_img()
        self.extract_data()
        self.save_as_json()
        self.remove_img()
    def remove_img(self):
        _file_list = os.listdir(self.image_folder_path)

        # get all files from image folder path
        for file in _file_list:
            file_path = os.path.join(self.image_folder_path, file)

            # check if the file exists before trying to delete it
            if os.path.isfile(file_path):
                try:
                    # try to delete the file
                    os.remove(file_path)
                except PermissionError:
                    # if the file is being used by another process, wait for it to be released
                    time.sleep(1)
                    if(file_path in self.image_names):
                        os.remove(file_path)

        
    
        



       



