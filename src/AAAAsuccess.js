import { useState, useEffect } from "react";
import axios from 'axios';


function AAAAsuccess() {
    // const [users, setUsers] = useState([]);

    // useEffect(() => {
    //     axios.get('http://localhost:3001/users')
    //   .then(response => {
    //     setUsers(response.data);
    //     console.log(response.data);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // }, []);

    // return (
    //     <>
    //         <h3>Reservation Page</h3>
    //         <ul>
    //             {users.length > 0 ? (
    //                 users.map((user, index) => (
    //                     <li key={index}>
    //                         {user.user_name}, {user.user_email}
    //                     </li>
    //                 ))
    //             ) : (
    //                 <p>No users found.</p>
    //             )}
    //         </ul>
    //     </>
    // );

    const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
        user_name: userName,
        user_email: userEmail,
        user_pw: userPassword,
      };
      axios.post('http://localhost:3001/signupG', data)
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>회원가입</h3>
      <div>
        <label htmlFor="user-name">이름:</label>
        <input
          type="text"
          id="user-name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="user-email">이메일:</label>
        <input
          type="email"
          id="user-email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호:</label>
        <input
          type="password"
          id="user-password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
      </div>
      <button type="submit">회원가입</button>
      {message && <p>{message}</p>}
    </form>
  );



}

export default AAAAsuccess;