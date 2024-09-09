import React, { useEffect, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../redux/slices/modalSlice';
import { toast } from 'react-toastify';
import { fetchGetItemsData, fetchPostItemData, fetchPutItemData } from '../redux/slices/apiSlice';

const Modal = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.authData);
  const {isOpen, modalType, task} = useSelector((state) => state.modal); 
  let title;
  if (modalType === 'more') {
    title = '할일 자세히';
  } else if (modalType === 'create') {
    title = '할일 추가하기';
  } else {
    title = '할일 수정하기';
  }
  // console.log(user);
  // console.log(modalType, task);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    isCompleted: false,
    isImportant: false,
    userId: user?.sub,
  });

  useEffect(() => {
    // console.log(task.isimportant);
    
    if(modalType === 'update' && task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        date: task.date || '',
        isCompleted: task.iscompleted || false,
        isImportant: task.isimportant || false,
        id: task._id || '',
      });
    } else if (modalType === 'more' && task){
      setFormData({
        title: task.title || '',
        description: task.description || '',
        date: task.date || '',
        isCompleted: task.iscompleted || false,
        isImportant: task.isimportant || false,
      })
    } 
    else {
      setFormData({
        title: '',
        description: '',
        date: '',
        isCompleted: false,
        isImportant: false,
        userId: user?.sub,
      })
    }
    
  }, [modalType, task]);

  const handleChange = (e) => {
    // setFormData({ ...formData, [e.target.name] : e.target.value});
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, // name 입력값을 받는데, 만약 타입이 checkbox 이면 checked 값을 받고 아니면 value 값을 받는다.
    }));
  };


  const handleSubmit = async(e) => {
    e.preventDefault();

    if(!user.sub) {
      alert('잘못된 사용자 입니다.');
      return;
    }

    if(!formData.title) {
      toast.error('제목을 입력해 주세요.');
      return;
    }

    if(!formData.description) {
      toast.error('내용을 입력해 주세요.');
      return;
    }
    
    if(!formData.date) {
      toast.error('날짜를 입력해 주세요.');
      return;
    }

    // console.log(formData);

    try {
      if(modalType === 'update' && task) {
        await dispatch(fetchPutItemData(formData)).unwrap();
        toast.success('할일이 수정되었습니다.');
      } else {
        await dispatch(fetchPostItemData(formData)).unwrap();
        toast.success('할일이 추가되었습니다.');
      }
      handleCloseModal();
      await dispatch(fetchGetItemsData(user?.sub)).unwrap();
    } catch (error) {
      console.error("Error adding task: ", error);
      toast.error('할일 추가에 실패했습니다.');
    }
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  }

  return (
    <div className='modal fixed bg-black bg-opacity-50 flex items-center justify-center w-full h-full left-0 top-0 z-50'>
      <div className="form-wrapper re bg-gray-700 rounded-md w-1/2 flex flex-col items-center relative p-4">
        <h2 className='text-2xl py-2 border-b border-gray-300 w-fit font-semibold'>
        {title}
        </h2>
        <form className='w-full' onSubmit={handleSubmit}>
          <div className="input-control">
            <label htmlFor="title">제목</label>
            <input type="text" id="title" name="title" placeholder='제목을 입력해주세요' value={formData.title} onChange={handleChange} readOnly={modalType === 'more' ? true : false} />
          </div>
          <div className="input-control">
            <label htmlFor="description">내용</label>
            <textarea id="description" name="description" placeholder='내용을 입력해주세요' value={formData.description} onChange={handleChange} readOnly={modalType === 'more' ? true : false} />
          </div>
          <div className="input-control">
            <label htmlFor="date">입력 날짜</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} readOnly={modalType === 'more' ? true : false} />
          </div>
          <div className="input-control toggler">
            <label htmlFor="isCompleted">완료 여부</label>
            {modalType === 'more' ? (
              <input type="checkbox" id="isCompleted" name="isCompleted" value={formData.isCompleted} checked={formData.isCompleted} readOnly />
            ) : (
              <input type="checkbox" id="isCompleted" name="isCompleted" value={formData.isCompleted} checked={formData.isCompleted} onChange={handleChange} />
            )}
            
          </div>
          <div className="input-control toggler">
            <label htmlFor="isImportant">중요성 여부</label>
            {modalType === 'more' ? (
              <input type="checkbox" id="isImportant" name="isImportant" value={formData.isImportant} checked={formData.isImportant} readOnly />
            ) : (
              <input type="checkbox" id="isImportant" name="isImportant" value={formData.isImportant} checked={formData.isImportant} onChange={handleChange} />
            )}
          </div>
          <div className="submit-btn flex justify-end">
            { modalType !== 'more' &&
            <button type="submit" className='flex justify-end bg-black w-fit py-3 px-6 rounded-md hover:bg-slate-900'>
              {
                modalType === 'update' ? '할일 수정하기' : '할일 추가하기'
              }
            </button>
            }
          </div>
        </form>
        <IoMdClose onClick={handleCloseModal} className='absolute right-5 top-5 cursor-pointer'/>
      </div>

      
      </div>
  )
}

export default Modal 