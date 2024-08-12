import React, { useEffect, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../redux/slices/authSlice';

const Navbar = () => {
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

  if (window.google) {
    window.google.accounts.id.initialize({
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
    <div className='navi'>
        {/* <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
                console.log('Login Failed');
            }}
        /> */}
        {
          isAuth ? (
            <div>
              <h2>{userInfo.userName}님 로그인</h2>
              <button onClick={handleLogout}>LOGOUT</button>
            </div>
          ) : (
            <div>
              <h2>로그인이 필요합니다.</h2>
              <button onClick={handleLogIn}>LOGIN</button>
            </div>
          )
        }
        {/* <button onClick={showName}>state check</button> */}
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