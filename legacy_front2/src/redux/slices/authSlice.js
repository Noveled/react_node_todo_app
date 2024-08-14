import { createSlice } from '@reduxjs/toolkit'; // 1. slice 생성

const initialState = { // 2. 초기 상태 정의
    userName: localStorage.getItem('userName') || null,
    userImage: localStorage.getItem('userImage') || null,
    userToken: localStorage.getItem('userToken') || null,
    userEmail: localStorage.getItem('userEmail') || null,
};

export const authSlice = createSlice({ // 3. slice reducer 구현
    name: 'auth',
    initialState,
    reducers: {
      login: (state, action) => {
        state.userName = action.payload.userName; // action 시 변화된 값이 payload 에 잡힘.
        state.userImage = action.payload.userImage;
        state.userToken = action.payload.userToken;
        state.userEmail = action.payload.userEmail;
        localStorage.setItem('userName', action.payload.userName);
        localStorage.setItem('userImage', action.payload.userImage);
        localStorage.setItem('userToken', action.payload.userToken);
        localStorage.setItem('userEmail', action.payload.userEmail);
      },
      logout: (state) => { // logout 기능은 상태만 변경하기 때문에 action 필요 X 
        state.userName = null;
        state.userImage = null;
        state.userToken = null;
        state.userEmail = null;
        localStorage.removeItem('userName');
        localStorage.removeItem('userImage');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userEmail');
      },
    },
});

// const a = { abc: 1, def: 2 };
// console.log(a);
// const { abc, def } = a;

// export const authActions = authSlice.actions;
export const { login, logout } = authSlice.actions; // 구조분해할당
export default authSlice.reducer; // 4. export 된 함수들을 store에 등록