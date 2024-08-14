import React from 'react'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LoadingSkeleton = () => {
  return (
    <p className='flex w-1/3 flex-col p-4 justify-between'>
      <div>
        <Skeleton width="40%" height="30px" />
      </div>
      <div>
        <Skeleton width="100%" height="30px" />
        <Skeleton width="100%" height="30px" />
        <Skeleton width="100%" height="30px" />
        <Skeleton width="100%" height="30px" />
      </div>
    </p>
  )
}

export default LoadingSkeleton