import { useState } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';

function PdfDumpForm() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const handleDrop = async (acceptedFiles) => {
    const promises = acceptedFiles.map(async (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onload = () => {
          resolve({
            name: file.name,
            data: reader.result,
          });
        };
      });
    });
    const files = await Promise.all(promises);
    setFileNames(files.map((file) => file.name));
    setPdfFiles(files.map((file) => file.data));
  };
  const handleRemove = (indexToRemove) => {
    setFileNames(fileNames.filter((_, index) => index !== indexToRemove));
    setPdfFiles(pdfFiles.filter((_, index) => index !== indexToRemove));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    pdfFiles.forEach((pdfFile, index) => {
      const filename = fileNames[index];
      data.append(filename, dataURItoBlob(pdfFile), filename);
    });
    try {
      const response = await axios.post(
        'http://localhost:8000/polls/addPdfs',
        data
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
    setFileNames([]);
    setPdfFiles([]);
  };

  // Helper function to convert a data URI to a Blob object
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'application/pdf' });
  };

  return (
    <div className="pdfDumpForm">
      <form onSubmit={handleSubmit}>
        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Click or Drag new Pdf's</p>
            </div>
          )}
        </Dropzone>
        {pdfFiles.length > 0 && (
          <div>            
            <h3>Files to be submitted:</h3>
            <ul>
              {fileNames.map((fileName, index) => (
                <li key={index}>
                  {fileName}{' '}
                  <button type="button" onClick={() => handleRemove(index)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button type="submit" disabled={pdfFiles.length === 0}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default PdfDumpForm;
