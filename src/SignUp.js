import React, { useState, useEffect } from 'react';
import './default.css';
import general from './images/general.png';
import owner from './images/owner.png';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [isGeneralUser, setIsGeneralUser] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const navigate = useNavigate();

    const handleGeneralUserClick = () => {
        setIsGeneralUser(true);
        setIsOwner(false);
        setIsPressed(true);
        setTimeout(() => {
            navigate('/SignUpGeneral');
        }, 500);
    };

    const handleOwnerClick = () => {
        setIsGeneralUser(false);
        setIsOwner(true);
        setIsPressed(true);
        setTimeout(() => {
            navigate('/SignUpOwner');
        }, 500);
    };

    return (
        <div className='signUPbody'>
            <div className='selectScreen'>
                <p className="guidance">사용자 유형을 선택해 주세요.</p>
                <div className='buttons'>
                    <button className={`button1 ${isGeneralUser && isPressed ? 'pressed' : ''}`} onClick={handleGeneralUserClick}>
                        <img src={general} style={{ width: '55%' }} /><br />
                        일반<br />
                        사용자
                    </button>
                    <button className={`button2 ${isOwner && isPressed ? 'pressed' : ''}`} onClick={handleOwnerClick}>
                        <img src={owner} style={{ width: '55%' }} /><br />
                        업체<br />
                        사장님
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignUp;