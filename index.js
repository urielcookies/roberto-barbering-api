const express = require('express')
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const {isEmpty, isEqual} = require('lodash');

const app = express()
const port = 3000;
app.use(express.json({extended: false}));

const db_config = {
  host     : '173.254.39.157',
  user     : 'hzmnrnmy_uriel',
  password : 'mercerst.13',
  database : 'hzmnrnmy_barber-scheduler'
};

var pool  = mysql.createPool({
  connectionLimit : 10,
  ...db_config
});

const queryResult = (resolve, reject, sql) => {
  pool.getConnection(function(err, connection) {
    if (err) {
      reject(err)
      throw err; // not connected!
    }
  
    // Use the connection
    connection.query(sql, function (error, results, fields) {
      // When done with the connection, release it.
      connection.release();

      // Handle error after the release.
      if (error) {
        reject(err)
        throw error;
      }
  
      // Don't use the connection here, it has been returned to the pool.
      resolve(results)
    });
  });
}

const queryResultPromise = (sql) => 
  new Promise((resolve, reject) => queryResult(resolve, reject, sql));

app.post('/login', async (req, res) => {
  const {Email, Password} = req.body
  if (isEqual(Email, '')) {
    return res.sendStatus(404);
  }

  if (isEqual(Password, '')) {
    return res.sendStatus(404);
  }

  const sql = `SELECT * FROM ${'`'}hzmnrnmy_barber-scheduler${'`'}.users WHERE Email = "${Email}";`;
  const result = await queryResultPromise(sql)

  if (isEmpty(result)) return res.sendStatus(404)
  else return res.send({
      Username: result[0].Username,
      Email: result[0].Email,
      Phone: result[0].Phone
    })
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})