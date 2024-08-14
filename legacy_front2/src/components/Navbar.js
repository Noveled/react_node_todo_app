import React, { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../redux/slices/authSlice';
import { navMenus } from '../utils/data';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";

const Navbar = ({ menuIdx }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth); // auth: store.js 에 정의된 reducer 객체요소의 키
  console.log(userInfo);

  const [isAuth, setIsAuth] = useState(false); // userInfo가 없는 상태 초기화

  useEffect(() => {
    const sotredToken = localStorage.getItem('userToken');
    const sotredPicture = localStorage.getItem('userImage');
    const sotredEmail = localStorage.getItem('userEmail');
    const sotredName = localStorage.getItem('userName');

    if (sotredToken) {
      dispatch(
        login({
        userName: sotredName, 
        userImage: sotredPicture,
        userToken: sotredToken,
        userEmail: sotredEmail
      }));
      setIsAuth(true);
    }
  }, [dispatch]);
  

  const handleLoginSuccess = (credentialResponse) => {
    const userData = jwtDecode(credentialResponse.credential);
    // userData.jti
    dispatch(login({
      userName: userData.given_name, 
      userImage: userData.picture,
      userToken: userData.jti, 
      userEmail: userData.email
    }));
    setIsAuth(true);
  };

  if (window.google) { // 구글 아이디가 가져와 졌을때
    window.google.accounts.id.initialize({ // 구글 값 초기화
      client_id: process.env.REACT_APP_AUTH_CLIENT_ID,
      callback: handleLoginSuccess,
    });
  }

  const handleLogIn = () => {
    window.google.accounts.id.prompt();
  }

  const handleLogout = () => {
    dispatch(logout());
    setIsAuth(false);
  }

  const showName = () => {
    console.log(userInfo);
  }

  return (
    <div className='navi bg-[#212121] w-1/5 h-full rounded-sm border border-gray-500 py-10 px-4 flex flex-col justify-between items-center'>
      <div className="logo-wrapper flex w-full items-center justify-center gap-6">
        <div className="logo"></div>
        <h2 className='font-semibold text-xl'>
          <Link to='/' className='font-customFontEn'>Noveled</Link>
        </h2>
      </div>
      
      <ul className="menus">
        {
          navMenus.map((menu, idx) => (
            <li key={idx} className={`border w-full rounded-sm mb-1 ${(idx===0) ? 'bg-red-400 border-red-200' : 'bg-gray-950 border-gray-700'}`}>
              <Link to={menu.to} className='flex gap-x-4 items-center py-2 px-10'>{menu.icon}{menu.label}</Link>
            </li>
          ))
        }
      </ul>
      {
        isAuth ? (
          <div>
            {/* <h2>{userInfo.userName}님 로그인</h2> */}
            <button onClick={handleLogout}>LOGOUT</button>
          </div>
        ) : (
          <div className='w-full'>
            {/* <h2>로그인이 필요합니다.</h2> */}
            <button onClick={handleLogIn} className='font-customFontKr flex justify-center items-center gap-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md w-full font-semibold'>
              <FcGoogle className='h-5 w-5'/>
              구글 로그인
            </button>
          </div>
        )
      }
    </div>
  )
}

export default Navbar



// (credentialResponse) => {
//   console.log(credentialResponse);
//   const userInfo = jwtDecode(credentialResponse.credential);
//   console.log(userInfo.jti);
//   console.log(userInfo.email);
//   console.log(userInfo.name);
//   console.log(userInfo.picture);

//   localStorage.setItem('token', userInfo.jti);
// }