const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const app = express();

const config = {
  user: 'postgres', //this is the db user credential
  database: 'test',
  password: '12345',
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



const pool = new pg.Pool(config);

// const string = "postgres://postgres:12345@localhost:5432/test";

pool.on('connect', () => {
  console.log('connected to the Database');
});

// Get route

app.get('/', (req, res,) => {
  pool.connect((err, client, done) => {
     if(err){
         console.log("not able to get connection "+ err);
         res.status(400).send(err);
     } 
     client.query("SELECT * FROM student where id = $1", [3], (err,result) => {
     
         if(err){
             console.log(err);
             res.status(400).send(err);
         }
         //res.status(200).send(result.rows);
         res.status(200).json(result);
         done(); // closing the connection;
     });
  });
});

// Post route

app.post('/add', (req, res,) => {
  pool.connect((err, client, done) => {
     if(err){
         console.log("not able to get connection "+ err);
         res.status(400).send(err);
     } 
     client.query("INSERT INTO student(id,firstname,age,lastname) VALUES($1, $2, $3, $4)", [req.body.id,req.body.firstname,req.body.age,req.body.lastname], (err,result) => {
     
         if(err){
             console.log(err);
             res.status(400).send(err);
         }
         res.status(200).send(result);
         done(); // closing the connection;
     });
  });
});


// Update route

app.post('/update', (req, res,) => {
  pool.connect((err, client, done) => {
     if(err){
         console.log("not able to get connection "+ err);
         res.status(400).send(err);
     } 
     client.query("UPDATE  student SET  firstname=$1, age=$2, lastname=$3 WHERE id=$4", [req.body.firstname,req.body.age,req.body.lastname,req.body.id], (err,result) => {
     
         if(err){
             console.log(err);
             res.status(400).send(err);
         }
          res.status(200).json(result);
         //console.log(json(result));
         done(); // closing the connection;
     });
  });
});

// Delete route by id

app.delete('/delete', (req, res,) => {
  pool.connect((err, client, done) => {
     if(err){
         console.log("not able to get connection "+ err);
         res.status(400).send(err);
     } 
     client.query("DELETE FROM student where id = $1", [req.body.id], (err,result) => {
     
         if(err){
             console.log(err);
             res.status(400).send(err);
         }
         res.status(200).send("msg: items deleted");
         done(); // closing the connection;
     });
  });
});


const port = 2000;

app.listen(port , (req,res) => {
  console.log(`Server running on ${port}`);
});