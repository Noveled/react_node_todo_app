import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // 툴킷 임포트
import {
  GET_TASKS_API_URL,
} from '../../utils/apiUrl'; // API URL 임포트
import { getRequest } from '../../utils/requestMethods'; // API 메서드 임포트

// 공통된 비동기 액션 생성 로직을 별도의 함수로 분리
const getItemsFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async () => {
    return await getRequest(apiURL);
  });
};

// Actions : get visitors
export const fetchGetItemsData = getItemsFetchThunk(
  'fetchGetItemsData',
  GET_TASKS_API_URL
);

const handleFulfilled = (stateKey) => (state, action) => {
  state[stateKey] = action.payload;
};

const handleRejected = (state, action) => {
  console.log('Error', action.payload);
  state.isError = true;
};


const apisSlice = createSlice({
  name: 'api',
  initialState: {
    getItemsData: null,
    isError: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetItemsData.fulfilled, handleFulfilled('getItemsData'))
      .addCase(fetchGetItemsData.rejected, handleRejected)
  },
});

export default apisSlice.reducer;
