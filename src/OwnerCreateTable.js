import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableHighlight, Text, Modal, View } from 'react-native';
import './default.css';
import StatusBar from './StatusBar';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import store from './store/store';

const Popup = ({ visible, onClose, onConfirm }) => {
    const [isYesPressed, setIsYesPressed] = useState(false);
    return (
        <Modal visible={visible} transparent={true} onRequestClose={onClose}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.message}>등록이 완료되었습니다.{"\n"}로그인 페이지로 이동합니다.</Text>
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

function OwnerCreateTable({ maxRows, maxCols }) {
    const [isPressed, setIsPressed] = useState(false);
    const ownerAddInfo = useSelector(state => state.ownerAddInfo);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlePressIn = () => {
        setIsPressed(true);
        setTimeout(() => {
            addTable();
        }, 170);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    const [popupVisible, setPopupVisible] = useState(false);

    const openPopup = () => {
        setPopupVisible(true);
        console.log("open");
    };

    const handleConfirm = () => {
        setPopupVisible(false);
        console.log("close");
        navigate('/SignIn');
    };

    // DB에 table_row, table_column 등록
    const addTable = () => {
        const tableInfo = {
            ...ownerAddInfo, // 기존 ownerInfo 객체의 값 복사
            table_row: rows,
            table_column: cols,
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

    maxRows = 7;
    maxCols = 7;
    const [rows, setRows] = useState(7);
    const [cols, setCols] = useState(7);

    const renderTable = () => {
        const table = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                row.push(
                    <td
                        key={`${i},${j}`}
                        style={{
                            border: "2px dashed #012640",
                            backgroundColor: "rgba(2, 75, 128, 0.5)",
                            width: "47px",
                            borderRadius: 5,
                            height: "47px",
                        }}
                    ></td>
                );
            }
            table.push(<tr key={i}>{row}</tr>);
        }
        return table;
    };

    const handleRowsChange = (e) => {
        let value = parseInt(e.target.value);
        if (value > maxRows) {
            value = maxRows;
        }
        if (value < 1 || '') {
            value = Math.max(Number(e.target.value), 1)
        }
        setRows(value);
    };

    const handleColsChange = (e) => {
        let value = parseInt(e.target.value);
        if (value > maxCols) {
            value = maxCols;
        }
        if (value < 1) {
            value = Math.max(Number(e.target.value), 1)
        }
        setCols(value);
    };

    return (
        <div className='signUPbody'>
            <StatusBar />

            <div className='Asection'>

                <div className='Afirst'>
                    <p>테이블 등록</p>
                    <p className='explain'> 가로와 세로의 테이블 최대 개수를 입력하세요.<br/>(단, 최대 7행 7열까지 등록 가능합니다.)</p>
                    <div className='tableInput'>
                        <input
                            type="number"
                            id="rows"
                            value={rows}
                            onChange={handleRowsChange}
                            onBlur={handleRowsChange}
                            max={maxRows}
                        />
                        <p className='icon'>
                            <FaTimes />
                        </p>
                        <input
                            type="number"
                            id="cols"
                            value={cols}
                            onChange={handleColsChange}
                            onBlur={handleColsChange}
                            max={maxCols}
                        />
                    </div>
                    <div className="table-wrapper">
                        <table
                            style={{
                                border: "5px solid #012640",
                                backgroundColor: "#F5F5F5",
                                borderCollapse: "separate",
                                borderSpacing: "10px",
                                boxShadow: '0px 0px 7px #012640',
                                borderRadius: 12,
                            }}
                        >
                            <tbody>{renderTable()}</tbody>
                        </table>
                    </div>
                </div>

                <div className='fifth'>
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
                        <Text style={isPressed ? styles.textPressed : styles.text}>등록</Text>
                    </TouchableHighlight>
                    {/* </div> */}
                    <Popup
                        visible={popupVisible}
                        onConfirm={handleConfirm}
                    />
                </div>

            </div>

        </div>
    );
}

export default OwnerCreateTable;

const buttonCommonStyles = {
    padding: 3,
    borderRadius: 5,
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
        position: 'fixed',
        bottom: 0,
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
        position: 'fixed',
        bottom: 0,
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