import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 데이터 가져오기 시뮬레이션
    setTimeout(() => {
      setData({
        title: 'Loaded Title',
        description: 'This is the description after data is loaded.',
      });
    }, 2000); // 2초 후 데이터 로드
  }, []);

  return (
    <div>
      <h1>
        {data ? data.title : <Skeleton width={200} />}
      </h1>
      <p>
        {data ? data.description : <Skeleton count={3} />}
      </p>
    </div>
  );
}

export default MyComponent;