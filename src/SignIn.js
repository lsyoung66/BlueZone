import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableHighlight, Text, Modal, View } from 'react-native';
import './default.css';
import idIcon from './images/id_icon.png';
import pwIcon from './images/pw_icon.png';
import logo from './images/logo.png';
import { Link } from 'react-router-dom';
import Main from './Main';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Popup = ({ visible, onClose, onConfirm, message }) => {
  const [isYesPressed, setIsYesPressed] = useState(false);

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={message === "아직 회원이 아닌가요?\n지금 가입하세요!" ? styles.errormessageSignup : styles.errormessage}>{message}</Text>
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

function SignIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [id, setID] = useState('');
  const [password, setPassword] = useState('');
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
    if(message === "아직 회원이 아닌가요?\n지금 가입하세요!")
    setTimeout(() => {
      navigate('/SignUp');
    }, 500);
  };

  const handlePressIn = () => {
    setIsPressed(true);
    setTimeout(() => {
      handleLogin();
    }, 170);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };


  const handleLogin = () => {

    console.log("login");

    if (!id.trim() || !password.trim()) {
      setMessage("모든 항목을 입력해주세요.");
      return;
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(id)) {
      setMessage("이메일 형식이 올바르지 않습니다.");
      return;
    }

    const data = {
      user_email: id,
      user_pw: password,
      owner_email: id,
      owner_pw: password,
    };

    axios.post('http://localhost:3001/signin', data)
      .then(response => {
        setMessage("");
        console.log(response.data);
        setTimeout(() => {
          setIsLoggedIn(true);
          navigate('/Main');
        }, 500);
      })
      .catch((error) => {
        setMessage("아직 회원이 아닌가요?\n지금 가입하세요!");
        console.error(error);
        
      });
  }

  useEffect(() => {
    const body = document.querySelector("body");
    body.style.setProperty("--status-bar-background-color", "#024B80");
    body.style.setProperty("--status-bar-color", "white");
  }, []);


  return (
    <div className='body'>
      {isLoggedIn ? (
        <>
          <Main />
        </>
      ) : (
        <div>
          <div className='section'>

            <div className='first'>
              <img src={logo} alt='logo' />
              <p>Sign In to BlueZone</p>
            </div>

            <div className='second'>
              <p>User ID</p>
              <div className="input-container">
                <img src={idIcon} alt="id_icon" />
                <input
                  type="text"
                  placeholder="enter your email address"
                  value={id}
                  onChange={(e) => setID(e.target.value)}
                />
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />
              </div>
              <hr />
            </div>

            <div className='fourth'>
              <label>
                <input type='checkbox' />&nbsp;
                Remember Me
              </label>
              <button onClick={(e) => { e.preventDefault(); }}>Forgot password?</button>

            </div>
            <div className='fifth'>
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
                <Text style={isPressed ? styles.textPressed : styles.text}>Sign In</Text>
              </TouchableHighlight>
              <Popup
                visible={message ? popupVisible : false}
                onConfirm={handleConfirm}
                message={message}
              />

              <div className='sixth'>
                <p className='inline'>
                  Not a member yet?
                  <Link to="/SignUp" className="no-underline">
                    {/* <button className='signUp' onClick={handleSignUp}>Sign Up</button> */}
                    <button className='signUp'>Sign Up</button>
                  </Link>
                </p>
                <button className='nonMember' onClick={(e) => { e.preventDefault(); }}>Use as a non-member</button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default SignIn;

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
  errormessageSignup: {
    fontSize: 18,
    marginVertical: 10,
    color: 'white',
    textAlign: 'center',
    lineHeight: 30,
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