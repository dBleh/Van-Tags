import PyPDF2
from reportlab.pdfgen import canvas
import io
import os
import json

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.units import inch



WIDTH = 612
HEIGHT = 792
MARGIN_LEFT = 110
MARGIN_RIGHT = 220
PRICEDIFF = 30
JSONFOLDERPATH = 'src/ExtractedJson'
priceFont = 60
class PDFGen:
    def __init__(self, top_left, top_right, bot_left, bot_right):
        self.top_l = top_left
        self.top_r = top_right
        self.bot_l = bot_left
        self.bot_r = bot_right
        
   
    def top_left(self):      
        
        # Create a canvas object for the page
        packet = io.BytesIO()
        c = canvas.Canvas(packet)
    

        c.setFontSize(14)
        # Insert the text at the specified position
        c.drawString(MARGIN_LEFT + 30, HEIGHT-150, os.path.splitext(self.top_l[0])[0].upper())
        c.drawString(MARGIN_LEFT - 10, HEIGHT-185, self.top_l[1])
        c.drawString(MARGIN_LEFT, HEIGHT-220, self.top_l[2])
        c.drawString(MARGIN_LEFT, HEIGHT-255, self.top_l[3]) 
        c.drawString(MARGIN_LEFT, HEIGHT-270, self.top_l[4]) 
        c.drawString(MARGIN_LEFT, HEIGHT-285, self.top_l[5]) 

        
        c.setFont("Helvetica-Bold",priceFont)
        c.drawString(MARGIN_LEFT - PRICEDIFF, HEIGHT-345, self.top_l[6]) 
        # Save the canvas to the PDF writer
        c.save()
        packet.seek(0)
        overlay = PyPDF2.PdfReader(packet).pages[0]
        return overlay

    def top_right(self):
        
        # Create a canvas object for the page
        packet = io.BytesIO()
        c = canvas.Canvas(packet)
        c.setFontSize(14)
        # Insert the text at the specified position
        c.drawString(WIDTH-MARGIN_RIGHT + 30, HEIGHT-150, os.path.splitext(self.top_r[0])[0].upper())
        c.drawString(WIDTH-MARGIN_RIGHT - 10, HEIGHT-185,self.top_r[1])
        c.drawString(WIDTH-MARGIN_RIGHT , HEIGHT-220, self.top_r[2])
        c.drawString(WIDTH-MARGIN_RIGHT + 5, HEIGHT-255, self.top_r[3])
        c.drawString(WIDTH-MARGIN_RIGHT + 5, HEIGHT-270, self.top_r[4])
        c.drawString(WIDTH-MARGIN_RIGHT + 5, HEIGHT-285, self.top_r[5])
        c.setFont("Helvetica-Bold",priceFont)

        c.drawString(WIDTH-MARGIN_RIGHT - PRICEDIFF, HEIGHT-345, self.top_r[6]) 
        # Save the canvas to the PDF writer
        c.save()
        packet.seek(0)
        overlay = PyPDF2.PdfReader(packet).pages[0]
        return overlay
    def bot_left(self):
        
        
        # Create a canvas object for the page
        packet = io.BytesIO()
        c = canvas.Canvas(packet) 
        c.setFontSize(14)
        # Insert the text at the specified position
        c.drawString(MARGIN_LEFT + 30, 275, os.path.splitext(self.bot_l[0])[0].upper())
        c.drawString(MARGIN_LEFT - 10, 240, self.bot_l[1])
        c.drawString(MARGIN_LEFT, 205, self.bot_l[2])
        c.drawString(MARGIN_LEFT, 170, self.bot_l[3])
        c.drawString(MARGIN_LEFT, 155, self.bot_l[4])
        c.drawString(MARGIN_LEFT, 140, self.bot_l[5])
        c.setFont("Helvetica-Bold",priceFont)
        c.drawString(MARGIN_LEFT - PRICEDIFF, 80, self.bot_l[6]) 
        # Save the canvas to the PDF writer
        c.save()
        packet.seek(0)
        overlay = PyPDF2.PdfReader(packet).pages[0]
        return overlay

    def bot_right(self):
       
        # Create a canvas object for the page
        packet = io.BytesIO()
        c = canvas.Canvas(packet)
        c.setFontSize(14)
        # Insert the text at the specified position
        c.drawString(WIDTH-MARGIN_RIGHT + 30, 275, os.path.splitext(self.bot_r[0])[0].upper())
        c.drawString(WIDTH-MARGIN_RIGHT - 10, 240, self.bot_r[1])
        c.drawString(WIDTH-MARGIN_RIGHT , 205, self.bot_r[2])
        c.drawString(WIDTH-MARGIN_RIGHT+ 5, 170, self.bot_r[3])
        c.drawString(WIDTH-MARGIN_RIGHT+ 5, 155, self.bot_r[4])
        c.drawString(WIDTH-MARGIN_RIGHT+ 5, 140, self.bot_r[5])

        c.setFont("Helvetica-Bold",priceFont)
        c.drawString(WIDTH-MARGIN_RIGHT - PRICEDIFF, 80, self.bot_r[6]) 
        
        # Save the canvas to the PDF writer
        c.save()
        packet.seek(0)
        overlay = PyPDF2.PdfReader(packet).pages[0]
        return overlay

    def make_pdf(self,model_one,model_two,model_three,model_four):
        
        # Open the PDF file in read-binary mode
        
        with open('src/emptyTags.pdf','rb') as pdf_file:
            # Create a PDF reader object
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            # Get the first page of the PDF
            page = pdf_reader.pages[0]
            
            # Create a PDF writer object
            pdf_writer = PyPDF2.PdfWriter()
            
            overlay = self.top_left()
            page.merge_page(overlay)
            overlay = self.top_right()
            page.merge_page(overlay)
            overlay = self.bot_left()
            page.merge_page(overlay)
            overlay = self.bot_right()
            page.merge_page(overlay)
            # Add the modified page to the writer object
            pdf_writer.add_page(page)
            
            # Save the modified PDF to a new file
            with open('src/modified.pdf', 'wb') as output_file:
                pdf_writer.write(output_file)
            
    def run_all(self):
        self.make_pdf(self.top_l,self.top_r,self.bot_l,self.bot_r)
