const express = require('express');
const mysql = require('mysql2');
const dbconfig = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);
const user_general = require('./lib/user_general.js');
const http = require('http');
const app = express();
const server = http.createServer(app); 
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server });

let count = 0;
const clientIDs = new Set();

wss.on('connection', function connection(ws) {
  // 새로운 클라이언트인 경우에만 count 값을 증가시킴
  if (!clientIDs.has(ws)) {
    count++;
    clientIDs.add(ws);
  }

  ws.on('close', function close() {
    // 클라이언트가 연결을 끊은 경우 clientIDs에서 제거하고 count 값을 감소시킴
    if (clientIDs.has(ws)) {
      count--;
      clientIDs.delete(ws);
    }
  });

  ws.send(`Current user count: ${count}`);

  wss.clients.forEach(function each(client) {
    client.send(`Current user count: ${count}`);
  });
});

// const cors = require('cors');
// app.use(cors());
// configuration =========================
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.set('port', process.env.PORT || 3001);

app.get('/', (req, res) => {
  res.send('Root');
});

app.get('/users', (req, res) => {
  // connection.query('SELECT * from user_general', (error, user_general) => {
  //   if (error) throw error;
  //   console.log('User info is: ', user_general);
  //   res.send(user_general);
  // });
  user_general.guser(req, res);
});

app.get('/owners', (req, res) => {
  connection.query('SELECT * from user_owner', (error, user_owner) => {
    if (error) throw error;
    console.log('Owner info is: ', user_owner);
    res.send(user_owner);
  });
});

app.get('/reservation', (req, res) => {
  connection.query('SELECT * from reservation', (error, reservation) => {
    if (error) throw error;
    console.log('reservation info is: ', reservation);
    res.send(reservation);
  });
});

// 회원가입
// app.post('/signupG', (req, res) => {
//   const { user_name, user_email, user_pw } = req.body;
//   connection.connect();
//   // 이메일 중복 확인
//   connection.query(`SELECT * FROM user_general WHERE user_email='${user_email}'`, (error, results) => {
//     if (error) throw error;

//     // 중복되는 이메일이 없을 경우 새로운 사용자 정보 추가
//     if (results.length === 0) {
//       // 데이터베이스에서 사용자 이름 가져오기
//       connection.query(`SELECT user_name FROM user_general WHERE user_email='${user_email}'`, (error, results) => {
//         if (error) throw error;

//         if (results.length > 0) {
//           const user_name = results[0].user_name;

//           // 새로운 사용자 정보 추가
//           connection.query(`INSERT INTO user_general (user_name, user_email, user_pw) VALUES ("${user_name}", "${user_email}", "${user_pw}")`, function (error, results, fields) {

//             res.status(200).json({ message: '회원가입이 완료되었습니다.' });
//           });
//         } else {
//           // 사용자 이름을 찾을 수 없을 경우 에러 메시지 반환
//           res.status(500).json({ message: '사용자 이름을 찾을 수 없습니다.' });
//         }
//       });
//     } else {
//       // 중복되는 이메일이 있을 경우 에러 메시지 반환
//       res.status(409).json({ message: '이미 가입된 이메일입니다.' });
//     }
//     connection.end();
//   });
// });

app.post('/signupG', (req, res) => {
  const { user_name, user_email, user_pw } = req.body;
  connection.query(`INSERT INTO user_general (user_name, user_email, user_pw) VALUES ("${user_name}", "${user_email}", "${user_pw}")`, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(409).json({ message: '이미 가입된 이메일입니다.' });
    } else {
      console.log(results);
      res.status(200).json({ message: '회원가입이 완료되었습니다.' });
    }
  });
});

app.post('/signupOV', (req, res) => {
  const { owner_email } = req.body;
  connection.query(`SELECT * FROM user_owner WHERE owner_email = "${owner_email}"`, function (error, results, fields) {
    if (error) {
      console.log(error);
    } else {
      if (results.length > 0) {
        res.status(409).send('Already existing email');
      }
    }
    connection.connect();
  });
});

app.post('/signupO', (req, res) => {
  const { owner_name, owner_email, owner_pw, company_name, company_contact, company_address, holiday, category, company_info, table_row, table_column } = req.body;
  connection.query(`INSERT INTO user_owner (owner_name, owner_email, owner_pw, company_name, company_contact, company_address, holiday, category, company_info, table_row, table_column) 
  VALUES ("${owner_name}", "${owner_email}", "${owner_pw}", "${company_name}", "${company_contact}", "${company_address}", "${holiday}", "${category}", "${company_info}", "${table_row}", "${table_column}")`, function (error, results, fields) {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
      res.status(200).json({ message: '회원가입이 완료되었습니다.' });
    }
  });
});

app.post('/signin', (req, res) => {
  const { user_email, user_pw, owner_email, owner_pw } = req.body;
  connection.query(`SELECT * FROM user_general WHERE user_email='${user_email}' AND user_pw='${user_pw}'`, function (error, user_general, fields) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    } else {
      connection.query(`SELECT * FROM user_owner WHERE owner_email='${owner_email}' AND owner_pw='${owner_pw}'`, function (error, user_owner, fields) {
        if (error) {
          console.log(error);
          res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        } else {
          if (user_general.length > 0) {
            // user_general 회원 로그인 성공
            console.log(user_general);
            res.status(200).json({ message: '일반 사용자 로그인 성공' });
          } else if (user_owner.length > 0) {
            // user_owner 회원 로그인 성공
            console.log(user_owner);
            res.status(200).json({ message: '업체 사장님 로그인 성공' });
          } else {
            // 이메일과 비밀번호가 일치하는 회원 정보가 없는 경우
            console.log(error);
            res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
          }
        }
      });
    }
  });
});

app.post('/loginUser', (req, res) => {
  const query = 'SELECT user_name FROM user_general WHERE id = "52"';
  connection.query(query, function (error, results, fields) {
    if (error) {
      console.error(error);
      res.status(500).send('Error occurred while executing query');
    } else if (results.length === 0) {
      res.status(404).send('No cafes found');
    } else {
      const userInfo = {
        userName: results[0].user_name
      };
      res.send(userInfo);
    }
  });
});

app.post('/infoCafe', (req, res) => {
  const category = req.body.category;
  const query = 'SELECT company_name, company_contact, company_address, holiday, category, company_info, table_row, table_column FROM user_owner WHERE category = "카페"';
  connection.query(query, function (error, results, fields) {
    if (error) {
      console.error(error);
      res.status(500).send('Error occurred while executing query');
    } else if (results.length === 0) {
      res.status(404).send('No cafes found');
    } else {
      const cafeInfo = {
        companyName: results[0].company_name,
        companyContact: results[0].company_contact,
        companyAddress: results[0].company_address,
        holiday: results[0].holiday,
        category: results[0].category,
        companyInfo: results[0].company_info,
        row: results[0].table_row,
        column: results[0].table_column,
      };
      res.send(cafeInfo);
    }
  });
});

app.post('/reservation', (req, res) => {
  const selected_cells = req.body.selected_cells;
  console.log(selected_cells)
  connection.query('INSERT INTO reservation (selected_cells) VALUES (?)', [selected_cells], (error, results) => {
    if (error) throw error;
    console.log('Selected cells inserted!');
  });
  res.send(selected_cells);
});

app.get('/reservationS', (req, res) => {
  connection.query('SELECT selected_cells FROM reservation ORDER BY id DESC', (error, results) => {
    if (error) throw error;
    console.log('Selected cells retrieved!');
    res.send(results);
  });
});

server.listen(app.get('port'), () => {
  console.log('Express server listening on port... http://localhost:' + app.get('port'));
});

server.on('request', function(req, res) {
  console.log("ining");
});