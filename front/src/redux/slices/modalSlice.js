import { createSlice } from '@reduxjs/toolkit'; 

const modalSlice = createSlice({
  name: 'modal',

  initialState: {
    isOpen: false,
    modalType: null,
    task: null,
  },

  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.modalType = action.payload.modalType;
      state.task = action.payload.task;

      // console.log(state.modalType);
      // console.log(state.task);
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
}); 

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer; 
