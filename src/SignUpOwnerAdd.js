import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableHighlight, Text, Modal, View } from 'react-native';
import './default.css';
import StatusBar from './StatusBar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import store from './store/store';

const Popup = ({ visible, onClose, onConfirm1, onConfirm2, message }) => {
    const [isYesPressed, setIsYesPressed] = useState(false);
    const [isNoPressed, setIsNoPressed] = useState(false);

    return (
        <Modal visible={visible} transparent={true} onRequestClose={onClose}>
            <View style={styles.container}>
                <View style={styles.content}>
                    {message ? <Text style={styles.errormessage}>{message}</Text> :
                        <Text style={styles.message}>회원가입이 완료되었습니다.{"\n"}매장 내 좌석 위치를 등록하시겠습니까?{"\n"}
                            <Text style={{ color: '#777777', fontSize: '19px' }}>(</Text>
                            <Text style={{ color: '#777777', fontSize: '14.7px' }}>등록하지 않을 시, 로그인 페이지로 이동합니다.</Text>
                            <Text style={{ color: '#777777', fontSize: '19px' }}>)</Text></Text>}
                    <View style={styles.buttonGroup}>
                        {message ? <TouchableHighlight
                            style={[styles.buttonYes, isYesPressed && styles.buttonYesPressed]}
                            onPressIn={() => {
                                setIsYesPressed(true);
                                setTimeout(() => {
                                    setIsYesPressed(false);
                                    onConfirm1();
                                }, 200);
                            }}
                            underlayColor='#fff'
                        >
                            <Text style={styles.buttonText}>확인</Text>
                        </TouchableHighlight> :
                            <>
                                <TouchableHighlight
                                    style={[styles.buttonYes, isYesPressed && styles.buttonYesPressed]}
                                    onPressIn={() => {
                                        setIsYesPressed(true);
                                        setTimeout(() => {
                                            setIsYesPressed(false);
                                            onConfirm2();
                                        }, 200);
                                    }}
                                    underlayColor='#fff'
                                >
                                    <Text style={styles.buttonText}>네</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    style={[styles.buttonNo, isNoPressed && styles.buttonNoPressed]}
                                    onPressIn={() => {
                                        setIsNoPressed(true);
                                        setTimeout(() => {
                                            setIsNoPressed(false);
                                            onClose();
                                        }, 200);
                                    }}
                                    // onPressOut={() => setIsNoPressed(false)}
                                    underlayColor='#fff'
                                >
                                    <Text style={styles.buttonText}>아니요</Text>
                                </TouchableHighlight>
                            </>}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

function SignUpOwnerAdd() {
    const [companyName, setCompanyName] = useState('');
    const [companyContact, setCompanyContact] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [holiday, setHoliday] = useState([]);
    const [category, setCategory] = useState('');
    const [companyInfo, setCompanyInfo] = useState('');
    const [isPressed, setIsPressed] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [popupVisible, setPopupVisible] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const ownerInfo = useSelector(state => state.ownerInfo);
    const dispatch = useDispatch();

    const openPopup = () => {
        setPopupVisible(true);
        console.log("open");
    };

    const handleConfirm1 = () => {
        setPopupVisible(false);
        console.log("close");
    };

    const handleConfirm2 = () => {
        setPopupVisible(false);
        console.log("close");
        navigate('/OwnerCreateTable');
    };

    const closePopup = () => {
        setPopupVisible(false);
        console.log("close");
        navigate('/SignIn');
        addTable();
    };

    const handlePressIn = () => {
        setIsPressed(true);
        setTimeout(() => {
            handleSignUp();
        }, 170);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    // 회원가입 함수
    const handleSignUp = () => {
        if (!companyName.trim() || !companyContact.trim() || !companyAddress.trim()) {
            setMessage("필수 항목을 모두 입력해주세요.\n( '휴일'과 '기타 정보'를 제외한 항목 )");
            return;
        }

        const phoneNumberRegExp = /^\d{2,3}-\d{3,4}-\d{4}$/;
        if (!phoneNumberRegExp.test(companyContact)) {
            setMessage("전화번호 형식이 올바르지 않습니다.\n010-xxxx-xxxx 형식으로 입력해주세요.");
            console.log(companyContact)
            return;
        }
        const holidayJson = JSON.stringify(holiday);
        const holidayString = holidayJson.slice(1, -1).replace(/"/g, '').replace(/,/g, ',');
        const ownerAddInfo = {
            ...ownerInfo, // 기존 ownerInfo 객체의 값 복사
            company_name: companyName,
            company_contact: companyContact,
            company_address: companyAddress,
            holiday: holidayString,
            category: category,
            company_info: companyInfo,
        };
        dispatch({
            type: "OWNER_ADD_INFO",
            payload: ownerAddInfo
        });
    };

    const ownerAddInfo = useSelector(state => state.ownerAddInfo);

    // DB에 table_row, table_column 등록
    const addTable = () => {
        const tableInfo = {
            ...ownerAddInfo, // 기존 ownerInfo 객체의 값 복사
            table_row: 5,
            table_column: 3,
        };
        dispatch({
            type: "TABLE_INFO",
            payload: tableInfo
        });

        axios.post('http://localhost:3001/signupO', tableInfo)
            .then(response => {
                console.log(response.tableInfo);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleDayClick = (day) => {
        const index = selectedDays.indexOf(day);
        if (index === -1) {
            // 선택되지 않은 요일을 클릭한 경우
            setSelectedDays([...selectedDays, day]);
            setHoliday([...holiday, day.toString()]);
        } else {
            // 이미 선택된 요일을 클릭한 경우
            setSelectedDays([...selectedDays.slice(0, index), ...selectedDays.slice(index + 1)]);
            setHoliday([...holiday.slice(0, index), ...holiday.slice(index + 1)]);
        }
    };

    const isDaySelected = (day) => {
        return selectedDays.includes(day);
    };

    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCategoryClick = (category) => {
        if (selectedCategory !== category) {
            setSelectedCategory(category);
            setCategory(category);
        }
    };

    const isCategorySelected = (category) => {
        return selectedCategory === category;
    };

    const renderButton = (category) => {
        const isActive = isCategorySelected(category);
        return (
            <button
                className={`buttonCategory ${isActive ? "pressed" : ""}`}
                onClick={() => handleCategoryClick(category)}
            >
                {category}
            </button>
        );
    };

    return (
        <div className='signUPbody'>
            <StatusBar />

            <div className='Asection'>

                <div className='Afirst'>
                    <p>Sign Up to BlueZone</p>
                </div>

                <div className='Asecond1'>
                    <p>업체명<span className="highlight">*</span></p>
                    <input
                        type="text"
                        placeholder='어쩌고 카페'
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <hr />
                </div>

                <div className='Asecond2'>
                    <p>전화번호<span className="highlight">*</span></p>
                    <input
                        type="tel"
                        pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}" required
                        value={companyContact}
                        onChange={(e) => setCompanyContact(e.target.value)}
                    />
                    <hr />
                </div>

                <div className='Asecond3'>
                    <p>위치<span className="highlight">*</span></p>
                    <input
                        type="text"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                    />
                    <hr />
                </div>

                <div className='Asecond4'>
                    <p>휴일</p>
                    <div className="day-container">
                        <button className={`buttonDay ${isDaySelected('월') ? 'pressed' : ''}`} onClick={() => handleDayClick('월')}>
                            월
                        </button>
                        <button className={`buttonDay ${isDaySelected('화') ? 'pressed' : ''}`} onClick={() => handleDayClick('화')}>
                            화
                        </button>
                        <button className={`buttonDay ${isDaySelected('수') ? 'pressed' : ''}`} onClick={() => handleDayClick('수')}>
                            수
                        </button>
                        <button className={`buttonDay ${isDaySelected('목') ? 'pressed' : ''}`} onClick={() => handleDayClick('목')}>
                            목
                        </button>
                        <button className={`buttonDay ${isDaySelected('금') ? 'pressed' : ''}`} onClick={() => handleDayClick('금')}>
                            금
                        </button>
                        <button className={`buttonDay ${isDaySelected('토') ? 'pressed' : ''}`} onClick={() => handleDayClick('토')}>
                            토
                        </button>
                        <button className={`buttonDay ${isDaySelected('일') ? 'pressed' : ''}`} onClick={() => handleDayClick('일')}>
                            일
                        </button>
                    </div>
                </div>

                <div className='Asecond5'>
                    <p>카테고리<span className="highlight">*</span></p>
                    <div className="category-container">
                        {renderButton("음식점")}
                        {renderButton("카페")}
                        {renderButton("노래방")}
                        {renderButton("기타")}
                    </div>
                </div>

                <div className='Asecond6'>
                    <p>기타 정보</p>
                    <input
                        type="text"
                        value={companyInfo}
                        onChange={(e) => setCompanyInfo(e.target.value)}
                    />
                    <hr />
                    <p className='explain'>※ 공지사항, 이벤트 등 제공하고자하는 가게정보를 입력해 주세요.</p>
                </div>

                <div className='fifth'>
                    {/* <Link to="/" className="no-underlineButton"> */}
                    <TouchableHighlight
                        activeOpacity={0.99}
                        style={isPressed ? styles.buttonPressed : styles.button}
                        onPressIn={() => {
                            handlePressIn();
                            setTimeout(() => {
                                openPopup();
                            }, 200);
                        }}
                        onPressOut={handlePressOut}
                        delayPressOut={500}
                        underlayColor="#012640"
                    >
                        <Text style={isPressed ? styles.textPressed : styles.text}>Sign Up</Text>
                    </TouchableHighlight>
                    <Popup
                        visible={popupVisible}
                        onClose={closePopup}
                        onConfirm1={handleConfirm1}
                        onConfirm2={handleConfirm2}
                        message={message}
                    />
                    {/* </Link> */}
                </div>

            </div>

        </div>
    );
}

export default SignUpOwnerAdd;

const buttonCommonStyles = {
    padding: 3,
    borderRadius: 5,
    backgroundColor: '#fff',
    width: '40%',
    marginHorizontal: 5,
    borderRadius: 15,
};

const buttonCommonPressedStyles = {
    ...buttonCommonStyles,
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: {
        height: 0,
        width: 0,
    },
    shadowColor: 'white'
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    content: {
        padding: 25,
        backgroundColor: "#012640",
        width: '80%',
        height: '30%',
        borderRadius: 30,
        borderWidth: 3.7,
        borderColor: '#fff',
    },
    errormessage: {
        fontSize: 18,
        marginTop: 30,
        marginBottom: 10,
        color: 'white',
        textAlign: 'center',
        lineHeight: 30,
    },
    message: {
        fontSize: 18,
        marginVertical: 12,
        color: 'white',
        textAlign: 'center',
        lineHeight: 30,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: '7%',
    },
    buttonYes: {
        ...buttonCommonStyles,
    },
    buttonYesPressed: {
        ...buttonCommonPressedStyles,
    },
    buttonNo: {
        ...buttonCommonStyles,
    },
    buttonNoPressed: {
        ...buttonCommonPressedStyles,
    },
    buttonText: {
        textAlign: 'center',
        color: '#012640',
        fontWeight: 'bold',
        fontSize: 17,
        padding: 10,
        borderColor: '#012640',
        borderRadius: 13,
        borderWidth: 2,
    },
    button: {
        backgroundColor: '#024B80',
        borderWidth: 2,
        borderColor: '#FFFDFE',
        boxShadow: '0px 0px 10px rgba(2, 75, 128, 0.25)',
        borderRadius: 10,
        width: '100%',
        height: 70,
        fontFamily: 'Open Sans',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPressed: {
        backgroundColor: '#024B80',
        borderWidth: 2,
        borderColor: '#FFFDFE',
        boxShadow: '0px 0px 10px rgba(1, 38, 64, 0.25)',
        borderRadius: 10,
        width: '100%',
        height: 70,
        fontFamily: 'Open Sans',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 25,
    },
    textPressed: {
        color: '#FFFFFF',
        fontSize: 25,
        textShadow: '0px 0px 5px #fff'
    }
});