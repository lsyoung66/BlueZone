import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableHighlight, Text, Modal, View } from 'react-native';
import './default.css';
import idIcon from './images/id_icon.png';
import emailIcon from './images/email_icon.png';
import pwIcon from './images/pw_icon.png';
import logo from './images/logo.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Popup = ({ visible, onClose, onConfirm, message }) => {
    const [isYesPressed, setIsYesPressed] = useState(false);

    return (
        <Modal visible={visible} transparent={true} onRequestClose={onClose}>
            <View style={styles.container}>
                <View style={styles.content}>
                    {message ? <Text style={styles.errormessage}>{message}</Text> :
                        <Text style={styles.message}>회원가입이 완료되었습니다.{"\n"}로그인 페이지로 이동합니다.</Text>}
                    <View style={styles.buttonGroup}>
                        <TouchableHighlight
                            style={[styles.buttonYes, isYesPressed && styles.buttonYesPressed]}
                            onPressIn={() => {
                                setIsYesPressed(true);
                                setTimeout(() => {
                                    setIsYesPressed(false);
                                    onConfirm();
                                }, 200);
                            }}
                            underlayColor='#fff'
                        >
                            <Text style={styles.buttonText}>확인</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

function SignUpGeneral() {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isPressed, setIsPressed] = useState(false);
    const navigate = useNavigate();
    const [popupVisible, setPopupVisible] = useState(false);

    const openPopup = () => {
        setPopupVisible(true);
        console.log("open");
    };

    const handleConfirm = () => {
        setPopupVisible(false);
        console.log("close");
        if (!message || message === "이미 가입된 회원입니다.") {
            navigate('/SignIn');
        }
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

    // 회원가입
    const handleSignUp = () => {
        if (!userName.trim() || !userEmail.trim() || !userPassword.trim()) {
            setMessage("모든 항목을 입력해주세요.");
            return;
        }
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(userEmail)) {
            setMessage("이메일 형식이 올바르지 않습니다.");
            return;
        }

        const data = {
            user_name: userName,
            user_email: userEmail,
            user_pw: userPassword,
        };
        axios.post('http://localhost:3001/signupG', data)
            .then(response => {
                setMessage("");
                console.log(response.data);
            })
            .catch((error) => {
                setMessage("이미 가입된 회원입니다.");
                console.error(error);
            });
    };


    useEffect(() => {
        const body = document.querySelector("body");
        body.style.setProperty("--status-bar-background-color", "#024B80");
        body.style.setProperty("--status-bar-color", "white");
    }, []);

    
    return (
        <div className='signUPbody'>
            <div className='section'>

                <div className='first'>
                    <img src={logo} alt='logo' />
                    <p>Sign Up to BlueZone</p>
                </div>

                <div className='second'>
                    <p>Name</p>
                    <div className="input-container">
                        <img src={idIcon} alt="id_icon" />
                        <input
                            type="text"
                            placeholder="username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                    <hr />
                </div>

                <div className='thirdEmail'>
                    <p>E-mail</p>
                    <div className="input-container">
                        <img src={emailIcon} alt='email_icon' />
                        <input
                            type="email"
                            placeholder="e-mail"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)} />
                    </div>
                    <hr />
                </div>

                <div className='third'>
                    <p>Password</p>
                    <div className="input-container">
                        <img src={pwIcon} alt='pw_icon' />
                        <input
                            type="password"
                            placeholder="password"
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)} />
                    </div>
                    <hr />
                </div>

                <div className='fifth'>
                    {/* <Link to="/SignIn" className="no-underlineButton"> */}
                    {/* <div onClick={navigate('/SignIn')} className="no-underlineButton"> */}
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
                        onConfirm={handleConfirm}
                        message={message}
                    />
                    {/* </Link> */}
                    {/* </div> */}
                    <div className='sixth'>
                        <p className='inline'>
                            Already have an account?
                            <Link to="/SignIn" className="no-underline">
                                <button className='signUp'>Sign In</button>
                            </Link>
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default SignUpGeneral;

const buttonCommonStyles = {
    padding: 3,
    backgroundColor: '#fff',
    width: '50%',
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
        padding: 23,
        backgroundColor: "#012640",
        height: '25%',
        width: '70%',
        borderRadius: 30,
        borderWidth: 3.7,
        borderColor: '#fff',
    },
    errormessage: {
        fontSize: 18,
        marginVertical: 10,
        color: 'white',
        textAlign: 'center',
        lineHeight: 50,
    },
    message: {
        fontSize: 18,
        marginVertical: 10,
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
        width: '102%',
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
        width: '102%',
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