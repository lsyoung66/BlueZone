import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, TouchableHighlight, Text, Modal, View } from 'react-native';
import './default.css';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Popup = ({ visible, onConfirm }) => {
    const [isYesPressed, setIsYesPressed] = useState(false);

    return (
        <Modal visible={visible} transparent={true}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.message}>예약이 완료되었습니다.{"\n"}메인 페이지로 이동합니다.</Text>
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

function Reservation(props) {
    const [selectedCellKeys, setSelectedCellKeys] = useState([]);
    const selectedCellKeysJson = JSON.stringify(selectedCellKeys);
    const [isPressed, setIsPressed] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const navigate = useNavigate();
    const [popupVisible, setPopupVisible] = useState(false);

    const openPopup = () => {
        setPopupVisible(true);
        console.log("open");
    };

    const handleConfirm = () => {
        setPopupVisible(false);
        console.log("close");
        navigate('/Main');
    };

    const handlePressIn = () => {
        setIsPressed(true);
        setTimeout(() => {
            addSelectedCell();
        }, 170);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    // 예약
    const addSelectedCell = () => {
        const cellData = {
            selected_cells: selectedCellKeysJson
        };
        // console.log(selectedCellKeysJson)
        // console.log(selectedCellKeys)
        axios.post('http://localhost:3001/reservation', cellData)
            .then(() => {
                setIsDisabled(true);
                setTimeout(() => {
                    setIsDisabled(false);
                }, 3600000);
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    };

    const handleClickCell = (key) => {

        if (isDisabled) {
            return; // 선택한 셀이 비활성화된 상태이면 클릭 이벤트 무시
        }
        // 클릭된 셀의 키값을 저장
        setSelectedCellKeys((prevSelectedCellKeys) => {
            const index = prevSelectedCellKeys.indexOf(key);
            if (index === -1) { // key값이 배열에 없으면 기존 배열에 추가
                return [...prevSelectedCellKeys, key];
            } else {
                return prevSelectedCellKeys.filter((item) => item !== key);
            }
        });

    };

    const renderTable = useCallback(() => {

        const table = [];

        for (let i = 0; i < `${props.cafeInfo.row}`; i++) {
            const row = [];
            for (let j = 0; j < `${props.cafeInfo.column}`; j++) {
                const key = `${i},${j}`; // 셀의 키값
                const isSelected = selectedCellKeys.indexOf(key) !== -1;
                row.push(
                    <td
                        key={key}
                        style={{
                            border: "1px solid #FFFFFF",
                            backgroundColor:
                                isSelected && isDisabled ? 'rgba(2, 75, 128, 0.25)'
                                    : isSelected ? "#024B80" : "rgba(2, 75, 128, 0.5)",
                            width: "47px",
                            borderRadius: 5,
                            height: "47px",
                            boxShadow: '2px 2px 3.5px rgba(1, 38, 64, 0.3)',
                            position: 'relative',
                        }
                        }
                        onClick={() => {
                            if (!isSelected || !isDisabled) {
                                handleClickCell(key);
                            }
                        }}
                    >
                        {isSelected && isDisabled && (
                            <FaTimes
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    fontSize: '35px',
                                }}
                            />
                        )}
                    </td >
                );
            }
            table.push(<tr key={i}>{row}</tr>);
        }
        return table;
    }, [selectedCellKeys, isDisabled, handleClickCell, props.cafeInfo.row, props.cafeInfo.column]);
    
    useEffect(() => {
        axios.get('http://localhost:3001/reservationS')
          .then(response => {
            const data = response.data[0].selected_cells;
            setSelectedCellKeys(data);
            console.log(data);
          })
          .catch(error => {
            console.log(error);
          });
      }, []);

    return (
        <>
            <div className="webSocket">
                <p>현재 2명이 보고있습니다.</p>
            </div>
            <div className="table-wrapper">
                <table
                    style={{
                        backgroundColor: "#F5F5F5",
                        borderCollapse: "separate",
                        borderSpacing: "15px",
                        padding: '5px',
                        boxShadow: '0px 0px 10px #fff',
                        borderRadius: 12,
                        width: '92%',
                    }}
                >
                    <tbody>{renderTable()}</tbody>
                </table>
            </div>
            <TouchableHighlight
                activeOpacity={0.99}
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
                <Text style={isPressed ? styles.reservationPressed : styles.reservation}>예약하기</Text>
            </TouchableHighlight>
            <Popup
                visible={popupVisible}
                onConfirm={handleConfirm}
            />
        </>
    );
}

export default Reservation;

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

const reservationButton = {
    position: 'fixed',
    width: 100,
    height: 30,
    left: '397px',
    top: '745px',
    fontSize: 17,
    lineHeight: 27,
    shadowColor: '#FFFFFF',
    shadowOffset: {
        width: 0,
        height: 0,
    },
    shadowRadius: 7,
    borderRadius: 10,
    fontWeight: '500',
    backgroundColor: '#024B80',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
};

const reservationButtonPressed = {
    ...reservationButton,
    fontWeight: '600',
    backgroundColor: '#FFFFFF',
    borderColor: '#012640',
    color: '012640',

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
    reservation: {
        ...reservationButton,
    },
    reservationPressed: {
        ...reservationButtonPressed,
    }
});