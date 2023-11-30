import os
import json

JSONFOLDERPATH = 'src/ExtractedJson'

DIMENSIONSLIST = ['Height','Length','Width','Article Diameter ( in mm )',
                  'Article Width ( in mm )','Article Height ( in mm )','Width :'
                  ,'Height :','Fixture Dimensions','Width / Length',]

BULBSLIST = ['Bulb Qty .','Socket Base Type','Wattage','max . Wattage ( 1 )','Lumens :','Total Lumens','Color Temperature','','']
DETAILSFIRST = ['Finish :','Finish']
DETAILSSECOND = ['Glass / Shade Colour',]
DETAILSTHIRD = ['Wire Length','Rods Inc.','Chain Inc.',]
class tagData:
    def __init__(self,item_list):
        self.items = item_list
        self.all_data = []
    def getFromJson(self):
        _file_list = os.listdir(JSONFOLDERPATH)
        _item_num = os.path.splitext(self.items)[0]   
        print(_item_num)
        for file in _file_list:
            if (file==_item_num+ '.json'):
                _data_path = os.path.join(JSONFOLDERPATH, file)
                with open(_data_path, 'r') as f:
                    _json_data = json.load(f)
                    self.all_data.append(self.return_info(_item_num,_json_data))
        return self.all_data                
    def return_info(self,_item_id,_json_data):
        _data_list = ['','','','','','']
        #EGLO
        _data_list[0] = _item_id.upper()

        for x in DIMENSIONSLIST:
            if(_json_data.get(x)):
                _data_list[1] += x + _json_data.get(x)  + " "
        for y in BULBSLIST:
            if(_json_data.get(y)):
                _data_list[2] +=  y + _json_data.get(y) + " "
        for z in DETAILSFIRST:
            if(_json_data.get(z)):
                _data_list[3] += z + _json_data.get(z) +  " "
        for a in DETAILSSECOND:
            if(_json_data.get(a)):
                _data_list[4] += a + _json_data.get(a) +  " "
        for b in DETAILSTHIRD:
            if(_json_data.get(b)):
                _data_list[5] += b + _json_data.get(b) +  " "

      
        return _data_list                    
                            
