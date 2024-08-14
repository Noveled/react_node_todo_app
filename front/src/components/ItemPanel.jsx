import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageTitle from './PageTitle';
import AddItem from './AddItem';
import Modal from './Modal';
import Item from './Item';
import { fetchGetItemsData } from '../redux/slices/apiSlice';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import LoadingSkeleton from './LoadingSkeleton';

const ItemPanel = ({ pageTitle }) => {
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.auth.authData);
  const isOpen = useSelector((state) => state.modal.isOpen);
  const getTasksData = useSelector((state) => state.api.getItemsData);
  const userKey = authData?.sub

  const [loading, setLoading] = useState(false);

  // console.log(userKey);
  // console.log(isOpen);
  // console.log(getTasksData);
  // console.log(loading);
  
  useEffect(() => {
    if(!userKey) {
      return;
    }

    const fetchGetItems = async () => {
      try {
        setLoading(true);
        await dispatch(fetchGetItemsData(userKey)).unwrap(); // useEffect 내부에서 dispatch 함수를 호출할 때는 async/await를 사용할 수 없으니 unwrap()을 사용.
      } catch (error) {
        console.error('Failed to fetch items: ', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGetItems();
  }, [dispatch, userKey])

  return (
    <div className="panel bg-[#212121 w-4/5 h-full rounded-md border border-gray-500] py-5 px-4">
      { userKey ? (
        <div className='panel-wrapper'>
            {
              isOpen && <Modal />
            }
            <PageTitle title={pageTitle} />
            
            <div className="items flex flex-wrap">
              {
                loading ? (
                  <SkeletonTheme baseColor="#202020" highlightColor="#444" width="100%" height="25vh">
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                  </SkeletonTheme>
                ) : (
                  getTasksData?.map((item, idx) => (
                    <Item key={idx} task={item} /> 
                ))
                )
              }
              <AddItem />
            {/* <div className="panel-items"></div> */}

          </div>
        </div>
      ) : (
        <div className='w-full h-full flex items-center justify-center'>
          <button className="font-customFontEn flex justify-center items-center gap-2 bg-gray-300 text-gray-900 py-2 px-4 rounded-md w-fit">
            <span className='text-sm font-semibold'>로그인이 필요한 서비스 입니다.</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemPanel;
