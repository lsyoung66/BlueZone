import { StyleSheet } from 'react-native';
import { FaPhoneAlt, FaMapMarkerAlt, FaCalendarTimes, FaClock, FaHandPointRight, FaMicrophoneAlt, FaMapMarkedAlt, FaRegHandPointRight, FaHome } from 'react-icons/fa';
import map from './images/map.png';
import './default.css';
{/* <FaHome /><br />
<FaMicrophoneAlt /><br /> */}
function Contact(props) {

    return (
        <>
            <p className='welcome'>'{props.cafeInfo.companyName}'에 오신걸 환영합니다!</p>
            <hr />
            <div className='contact'>
                <div>
                    <FaMapMarkerAlt style={styles.icon} />{/* <FaMapMarkedAlt/>/ */}
                    <span>{props.cafeInfo.companyAddress}</span>
                </div>
                <img src={map} alt="map" style={styles.map} />
                <div>
                    <FaPhoneAlt style={{ ...styles.icon, transform: "rotate(10deg)" }} />
                    <a href={`tel:${props.cafeInfo.companyContact}`}>
                        {props.cafeInfo.companyContact}
                    </a>
                </div>
                <div>
                    <FaCalendarTimes style={styles.icon} />
                    <spqn>{props.cafeInfo.holiday.split(',').map((day) => day.trim()).join(', ')} 휴일</spqn>
                </div>
                <div>
                    <FaClock style={styles.icon} />
                    <span>13:00 - 21:00 영업</span>
                </div>
                <div>
                    <FaHandPointRight style={styles.icon} />
                    <span>{props.cafeInfo.companyInfo}</span>
                </div>
            </div>
        </>
    );
}

export default Contact;

const styles = StyleSheet.create({
    icon: {
        fontSize: '30px',
        backgroundColor: 'transparent',
        borderWidth: 0,
        paddingRight: 10,
        shadowOffset: {
            height: 0,
            width: 0,
        },
        shadowColor: 'white',
        shadowOpacity: 0.5,
        elevation: 10,
        textShadow: '0px 0px 5px rgba(255, 255, 255, 1)',
    },
    map: {
        position: 'relative',
        left: '40px',
        height: '150px',
        width: '330px',
        marginBottom: '20px',
        marginTop: '-17px',
    }
});