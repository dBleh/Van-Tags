import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'



const initialState = {
  received_items: [],
  tagPdf:[],
  pdfs:[],
  pdf: null,
  pdfInd: 0,
  items: [['', '', '','','','',''],['', '', '','','','',''],['', '', '','','','',''],['', '', '','','','','']],
  pdfData: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

export const removePdfData  = createAsyncThunk( 'auth/removePdfData',
async (info, thunkAPI) => {
  try {
    return await authService.removePdfData()
  } catch (error) {
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
}
)

export const getPdfData = createAsyncThunk( 'auth/getPdfData',
async (info, thunkAPI) => {
  try {
    return await authService.getPdfData(info)
  } catch (error) {
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
}
)

export const changeInd = createAsyncThunk( 'auth/changeInd',
async (info, thunkAPI) => {
  try {
    return await authService.changeInd(info)
  } catch (error) {
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
}
)

export const editItem = createAsyncThunk( 'auth/editItem',
async (info, thunkAPI) => {
  try {
    
    return await authService.editItem(info)
  } catch (error) {
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString()
      
    return thunkAPI.rejectWithValue(message)
  }
}
)

export const addItem =  createAsyncThunk( 'auth/addItem',
async (info, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const t = {
      'new': info,
      'old': state.auth.items
    }
    return await authService.addItem(t)
  } catch (error) {
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
}
)


export const pdfToExtract = createAsyncThunk(
  'auth/pdfToExtract',
  async (info, thunkAPI) => {
    try {
      return await authService.pdfToExtract(info)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)
//gets items based on search input
export const getSearch = createAsyncThunk(
  'auth/getSearch',
  async (info, thunkAPI, ) => {
    try {
      return await authService.getSearch(info)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)
export const getSel = createAsyncThunk(
  'auth/getSel',
  async (info, thunkAPI) => {
    try {
      return await authService.getSel(info)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const getTagPdf = createAsyncThunk(
  'auth/getTagPdf',
  async (info, thunkAPI) => {
    try {
      return await authService.getTagPdf(info)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const addPdfs = createAsyncThunk(
  'auth/addPdfs',
  async (info, thunkAPI) => {
    try {
      return await authService.addPdfs(info)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

 
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(pdfToExtract.pending, (state) => {
      state.isLoading = true
      
    })
    .addCase(getSel.pending, (state) => {
      state.isLoading = true
      
    })
    .addCase(getSel.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.pdfs[action.payload[0]['index']] = action.payload[0]
      
    })
    .addCase(getSel.rejected, (state, action) => {
      state.isLoading = false
      state.isError = true
      state.message = action.payload
    })
    .addCase(getTagPdf.pending, (state) => {
      state.isLoading = true
      
    })
    .addCase(getTagPdf.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.tagPdf = action.payload
      
    })
    .addCase(getTagPdf.rejected, (state, action) => {
      state.isLoading = false
      state.isError = true
      state.message = action.payload
    })
    .addCase(getPdfData.fulfilled, (state,action) =>{
      state.isLoading = false
      state.isSuccess = true
      state.items[action.payload[0]][1] = action.payload[1]['size']
      state.items[action.payload[0]][2] = action.payload[1]['bulbs']
      state.items[action.payload[0]][3] = action.payload[1]['detailsFirst']
      state.items[action.payload[0]][4] = action.payload[1]['detailsSecond']
      state.items[action.payload[0]][5] = action.payload[1]['detailsThird']
      
    })
    .addCase(addItem.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.items = action.payload
      
    })
    .addCase(changeInd.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.pdfInd = action.payload
      
    })
    .addCase(removePdfData.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.pdfData = action.payload
      
    })
    .addCase(editItem.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.items = action.payload
      
    })
    .addCase(pdfToExtract.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.pdf= action.payload
      
    })
    .addCase(pdfToExtract.rejected, (state, action) => {
      state.isLoading = false
      state.isError = true
      state.message = action.payload
    })
      .addCase(getSearch.fulfilled, (state, action) => {
        if(action.payload !== 'None'){
        state.received_items = [...state.received_items, action.payload]}
      })
  },
})

export const { reset } = authSlice.actions
export default authSlice.reducer
