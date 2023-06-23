const express = require('express');
const app = express();

// GET API: MySQL 데이터베이스에서 데이터 가져오기
app.get('/api/data', (req, res) => {
  const query = 'SELECT * FROM app_db';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching data from MySQL database: ', error);
      res.status(500).send('Internal server error');
    } else {
      res.send(results);
    }
  });
});

// POST API: MySQL 데이터베이스에 데이터 추가하기
app.post('/api/data', (req, res) => {
  const { data } = req.body;
  const query = `INSERT INTO app_db (column1, column2, column3) VALUES ('${data.column1}', '${data.column2}', '${data.column3}')`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error inserting data into MySQL database: ', error);
      res.status(500).send('Internal server error');
    } else {
      res.send('Data inserted into MySQL database!');
    }
  });
});