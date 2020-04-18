const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 2020;




const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'gestion_citations'
});

connection.connect((error)=>{
    if(error) console.log(error);
     console.log('Database Connected!');
});


app.use(express.static(path.join(__dirname, 'public','css')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));





//------------------------------------Routes Part----------------------------------

app.get('/',(req, res) => {

    let sql = "SELECT * FROM auteurs";
    connection.query(sql, (err, rows) => {
      console.log(rows);
        if(err) throw err;
        res.render('Home', {
            title : 'Tout les Auteurs',
            rows : rows
        });

    });
});

app.get('/add',(req, res) => {
	// page add author
    res.render('AjoutAuteur', {
        title : 'Ajouter Un Auteur',
    });
});

app.post('/signUp',(req, res) => {

    let data = {id_Auteur: req.body.id, Nom: req.body.nom, Age: req.body.age, Nationalite: req.body.natio};
    let sql = "INSERT INTO auteurs SET ?";
    connection.query(sql, data,(err, results) => {
      if(err) return err;
      res.redirect('/');
    });
});

app.get('/edit/:userId',(req, res) => {

    const auteurId = req.params.userId;
    let sql = `Select * from auteurs where id_Auteur = ${auteurId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('UpdateAuteur', {
            title : 'Auteur Modification',
            row : result[0]
        });
    });
});

app.post('/update',(req, res) => {

  let userId = req.body.id;


    let sql = `update auteurs SET Nom = '${req.body.nom}', Age = ${req.body.age}, Nationalite = '${req.body.natio}' where id_Auteur = ${userId}`;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});



app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from auteurs where id_Auteur = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});


app.listen(port, (error)=>{
  console.log(`Listening on port ${port}`);
});
