import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeleteItemData, fetchGetItemsData, fetchUpdateCompletedData } from '../redux/slices/apiSlice';
import { openModal } from '../redux/slices/modalSlice';

import { toast } from 'react-toastify';
import { MdEditDocument } from "react-icons/md";
import { FaTrash } from "react-icons/fa";


const Item = ({task}) => {
  const { _id, title, date, description, iscompleted, isimportant, userid } = task;
  const dispatch = useDispatch();

  // console.log(iscompleted);

  const [isCompleted, setIsCompleted] = useState(iscompleted);
  const [isImportant, setIsImportant] = useState(isimportant);

  // 툴팁 추가
  const Tooltip = ({ component, text = 'tooltip' }) => (
    <div className="tooltip-componet group relative">
      {component}
      <span class="componet-tooltip group-hover:scale-100">{text}</span>
    </div>
  );

  // console.log(title);
  const deleteItem = async () => {
    const confirm = window.confirm("아이템을 삭제하시겠습니까?");
    
    if(!confirm) return;

    if (!_id){
      toast.error('잘못된 사용자 접근 입니다.');
      return;
    }

    try {
      await dispatch(fetchDeleteItemData(_id)).unwrap();
      toast.success('아이템이 삭제되었습니다.');

      await dispatch(fetchGetItemsData(userid)).unwrap();
    } catch (error) {
      toast.error('아이템 삭제에 실패했습니다.');
      console.error(error);
    }
  }

  const changeCompleted = async () => {
    // setIsCompleted(!isCompleted)을 호출하면 상태 업데이트가 비동기적으로 이루어지기 때문에, isCompleted의 값이 즉시 변경되지 않는다.
    // 따라서 updateCompletedData 객체를 생성할 때 isCompleted의 이전 값이 사용된다. 이로 인해 true/false가 한 단계씩 밀리게 된다.
    const newIsCompleted = !iscompleted
    setIsCompleted(newIsCompleted);
    
    // const temp = useSelector((state) => state.)
    const updateCompletedData = {
      itemId: _id,
      isCompleted: newIsCompleted,
    };

    const options = {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateCompletedData),
    }
    // console.log("c", options);

    await dispatch(fetchUpdateCompletedData(options)).unwrap();
    newIsCompleted
      ? toast.success('할일을 완료했습니다.')
      : toast.warning('할일을 깜박하지 마세요!');
    await dispatch(fetchGetItemsData(userid)).unwrap();
  };

  const handleOpenModal = () => {
    dispatch(openModal({ modalType: 'update', task }));
  }

  const handleOpenMoreModal = () => {
    dispatch(openModal({ modalType: 'more', task }));
  }

  function truncateString(txt, n) {
    // 문자열이 n 글자를 초과하는지 확인
    if (txt.length > n) {
        // 초과하는 경우, n 길이만큼 자르고 '...' 추가
        return txt.slice(0, n) + '...';
    } else {
        // 초과하지 않으면 원본 문자열 반환
        return txt;
    }
}


  return (
    <div className='item w-1/3 h-[25vh] p-[0.25rem]'>
      <div className='flex flex-col justify-between w-full h-full border border-gray-500 rounded-md py-3 px-4'>
        <div className="upper">
          <h2 className='flex justify-between text-xl font-normal mb-3 relative pb-2'>
            <span className='w-full h-[1px] bg-gray-500 absolute bottom-0'></span>{truncateString(title, 10)}
            <span className='text-sm py-1 px-3 border border-gray-500 rounded-md hover:bg-gray-700 cursor-pointer' onClick={handleOpenMoreModal}>자세히</span>
          </h2>
          <p style={{whiteSpace: 'pre-wrap'}}>{truncateString(description, 8)}</p>
        </div>
        <div className="lower">
          <p className='text-sm mb-1'>{date}</p>
          <div className="item-footer flex justify-between">
            <div className="item-footer-left flex gap-x-2">
              {
                iscompleted ? (
                  <button className='block py-1 px-4 bg-green-400 text-sm text-white rounded-md' onClick={changeCompleted}>Completed</button>
                ) : (
                  <button className='block py-1 px-4 bg-green-200 text-sm text-white rounded-md' onClick={changeCompleted}>InCompleted</button>
                )
              }
              {
                isimportant ? (
                  <button className='block py-1 px-4 bg-red-400 text-sm text-white rounded-md'>Important</button>
                ) : (
                  <button className='block py-1 px-4 bg-red-200 text-sm text-white rounded-md'>Unimportant</button>
                )
              }
              
            </div>
            <div className="item-footer-right flex gap-x-4 items-center">
              <button>
                <MdEditDocument className='w-5 h-5' onClick={handleOpenModal}/>
              </button>
              <Tooltip component={<button><FaTrash className='delete relative' onClick={deleteItem} /></button>} text='할일 삭제' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item