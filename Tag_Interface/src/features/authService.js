import axios from 'axios'


const removePdfData  = async() => {
  return null
}

const addPdfs = async (info) => {
  const response = await axios.post('http://localhost:8000/polls/addPdfs', info, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
}

const getPdfData = async (info) => {
  const response = await axios.post('http://localhost:8000/polls/getItemData', info, {
  });
  
  return response.data;
}
const changeInd = async(ind) => {
  return ind
}

const editItem = async(info) => {
  return info
}
const addItem = async(info) => {
  var temp = []

  if(info.old.length > 0){
    info.old.forEach((item)=>{
      temp.push(item)
    })
   
  }
  temp.push(info.new)
  return temp
}
//Representative Service Section
const pdfToExtract = async (info) => {
  const form_data = new FormData();
  form_data.append('my_list_key', info);
  const response = await axios.post('http://localhost:8000/polls/', info)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  return response.data;
};
const getSearch = async (info) => {
  const response = await axios.post('http://localhost:8000/polls/search', info, {
  });
  
  return response.data;
}
const getSel = async (info) => {
  const response = await axios.post('http://localhost:8000/polls/selPdf', info, {
  });
 
  return response.data;
}

const getTagPdf = async (info) => {
  const response = await axios.post('http://localhost:8000/polls/getTagPdf', info, {
  });
  return response.data;
}

const authService = {
  addPdfs,
  getTagPdf,
  removePdfData,
  getPdfData,
  changeInd,
  editItem,
  addItem,
  getSel,
  pdfToExtract,
  getSearch,
}

export default authService
