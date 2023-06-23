import React, { useEffect, useState } from 'react';
import StatusBar from './StatusBar';
import './default.css';
import contact1 from './images/contact1.png';
import contact2 from './images/contact2.png';
import reservation1 from './images/reservation1.png';
import reservation2 from './images/reservation2.png';
import share1 from './images/share1.png';
import share2 from './images/share2.png';
import like1 from './images/like1.png';
import like2 from './images/like2.png';
import Contact from './Contact';
import Reservation from './Reservation';
import Share from './Share';
import Like from './Like';
import axios from 'axios';

function Info() {
    const [contactImg, setContactImg] = useState(contact2);
    const [reservationImg, setreservationImg] = useState(reservation1);
    const [shareImg, setshareImg] = useState(share1);
    const [likeImg, setlikeImg] = useState(like1);
    const [showContactScreen, setShowContactScreen] = useState(true);
    const [showReservationScreen, setShowReservationScreen] = useState(false);
    const [showShareScreen, setShowShareScreen] = useState(false);
    const [showLikeScreen, setShowLikeScreen] = useState(false);
    const [cafeInfo, setCafeInfo] = useState({
        companyName: '',
        companyContact: '',
        companyAddress: '',
        holiday: '',
        category: '',
        companyInfo: '',
        row: '',
        column: ''
    });

    useEffect(() => {
        axios.post('http://localhost:3001/infoCafe', {
            category: '카페',
        })
            .then(res => {
                setCafeInfo(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);
    
    const ws = new WebSocket('ws://localhost:3001');

    ws.onmessage = function (event) {
        const message = event.data;
        console.log(message);
    };

    const handleClickContactImg = () => {
        // setContactImg((prevImg) => prevImg === contact1 ? contact2 : contact1);
        if (contactImg === contact1) {
            setContactImg(contact2);
            setreservationImg(reservation1);
            setshareImg(share1);
            setlikeImg(like1);
            setShowContactScreen(true);
            setShowReservationScreen(false);
            setShowShareScreen(false);
            setShowLikeScreen(false);
        } else {
            return undefined; // onClick 이벤트 비활성화

        }
    };

    const handleClickReservationImg = () => {
        // setreservationImg((prevImg) => prevImg === reservation1 ? reservation2 : reservation1);
        if (reservationImg === reservation1) {
            setContactImg(contact1);
            setreservationImg(reservation2);
            setshareImg(share1);
            setlikeImg(like1);
            setShowContactScreen(false);
            setShowReservationScreen(true);
            setShowShareScreen(false);
            setShowLikeScreen(false);
        } else {
            return undefined;
        }
    };

    const handleClickShareImg = () => {
        // setshareImg((prevImg) => prevImg === share1 ? share2 : share1);
        if (shareImg === share1) {
            setContactImg(contact1);
            setreservationImg(reservation1);
            setshareImg(share2);
            setlikeImg(like1);
            setShowContactScreen(false);
            setShowReservationScreen(false);
            setShowShareScreen(true);
            setShowLikeScreen(false);
        } else {
            return undefined;
        }
    };

    const handleClickLikeImg = () => {
        // setlikeImg((prevImg) => prevImg === like1 ? like2 : like1);
        if (likeImg === like1) {
            setContactImg(contact1);
            setreservationImg(reservation1);
            setshareImg(share1);
            setlikeImg(like2);
            setShowContactScreen(false);
            setShowReservationScreen(false);
            setShowShareScreen(false);
            setShowLikeScreen(true);
        } else {
            return undefined;
        }
    };

    return (
        <div className='Rbody'>
            <StatusBar />
            <div className="Rheader">
                <p>{cafeInfo.companyName}</p>
                <div className="cafeInfo">
                    <p>237m</p>
                    <p>{cafeInfo.category}</p>
                </div>
            </div>

            <div className='Rsection'>
                <div className='imgGroup'>
                    <img id='contact' src={contactImg} alt='contact' onClick={handleClickContactImg} />
                    <img id='reservation' src={reservationImg} alt='reservation' onClick={handleClickReservationImg} />
                    <img id='share' src={shareImg} alt='share' onClick={handleClickShareImg} />
                    <img id='like' src={likeImg} alt='like' onClick={handleClickLikeImg} />
                </div>
                <div className='article'>
                    <div className='someScreen'>
                        {showContactScreen && <Contact cafeInfo={cafeInfo} />}
                        {showReservationScreen && <Reservation cafeInfo={cafeInfo}/>}
                        {showShareScreen && <Share />}
                        {showLikeScreen && <Like />}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Info;