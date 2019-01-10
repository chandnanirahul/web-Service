const express = require('express');
const bodyparser = require('body-parser');
const pg = require('pg');
const app = express();


const pool = new pg.Pool();

const string = "postgres://postgres:12345@localhost:5432/test";


app.get('/', (req, res,) => {
  pool.connect(string, (err, client, done) => {
     if(err){
         console.log("not able to get connection "+ err);
         res.status(400).send(err);
     } 
     client.query("SELECT * FROM student where id = $1", [1], (err,result) => {
     
         if(err){
             console.log(err);
             res.status(400).send(err);
         }
         res.status(200).send(result.rows);
         done(); // closing the connection;
     });
  });
});

app.post('/add', (req, res,) => {
  pool.connect(string, (err, client, done) => {
     if(err){
         console.log("not able to get connection "+ err);
         res.status(400).send(err);
     } 
     client.query("INSERT INTO student(id,firstname,age,lastname) VALUES($1, $2, $3, $4)", [req.body.id,req.body.firstname,req.body.age,req.body.lastname], (err,result) => {
     
         if(err){
             console.log(err);
             res.status(400).send(err);
         }
         res.status(200).send(result.rows);
         done(); // closing the connection;
     });
  });
});


const port = 2000;

app.listen(port , (req,res) => {
  console.log(`Server running on ${port}`);
});