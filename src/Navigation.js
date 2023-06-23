import React, { useState, useEffect } from 'react';
import navIcon from './images/navIcon.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navigation = ({ isOpen, onClose }) => {
  const [userInfo, setUserInfo] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const navigate = useNavigate();

  const handleOverlayClick = () => {
    if (isOpen) {
      onClose();
    }
  };

  const logoutClicked = () => {
    setIsPressed(true);
    setTimeout(()=> {
      navigate('/SignIn');
    },200)
  };

  useEffect(() => {
    axios.post('http://localhost:3001/loginUser')
      .then(res => {
        setUserInfo(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <div className={`navigation ${isOpen ? 'open' : ''}`}>
        {isOpen && <div className="overlay" onClick={handleOverlayClick} />}
        <div className="navHeader">
          <img src={navIcon} alt='id' />
          <p>{userInfo.userName} &nbsp;&gt;</p>
        </div>
        <div className='navButtons'>
          <p>관심업체 목록</p>
          <p>업체 등록 요청</p>
          <p>내 후기 관리</p>
          <p>알림 관리</p>
          <p>예약내역</p>
          <p>설정</p>
          <button className={`logout ${isPressed ? 'pressed' : ''}`} onClick={logoutClicked}>Logout</button>
        </div>
      </div>
    </>
  );
};

export default Navigation;