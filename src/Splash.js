import React from 'react';
import splash from './images/logo_splash.png';
import './default.css';

function Splash() {
    return (
        <div className='Sbody'>
            <img src={splash} alt="splash_logo" className="splash" />
        </div>
    );
}

export default Splash;