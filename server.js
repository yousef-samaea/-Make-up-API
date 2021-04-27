'user strict';

// application dependencies
require('dotenv').config();

const express = require('express');
const pg = require ('pg');
const cors = require('cors');
const superagent = require ('superagent');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 3000;


// Database
const client = new pg.Client(process.env.DATABASE_URL);
// const client = new pg.Client({ connectionString: process.env.DATABASE_URL,   ssl: { rejectUnauthorized: false } });

// app
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
let all = [];
app.get(('/', homePage))
app.post('/searchresults', showResults)
app.get('/add', addData)
app.get('/cart', renderCart)
app.get('/delete', handleDelete)
app.get('update', handleUpdate)
function homePage(req,res){
    let url =''
}
function showResults(req,res){
let product = req.body.productName;
let min = req.body.min;
let max = req.body.max;
let url = `http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline&price_greater_than=${min}&price_less_than=${max}`
superagent.get(url)
.then(makeupData => {
    makeupData.forEach(item => {
        let newProduct = new Product(item)
        all.push(newProduct)
    })
    
    res.render('allProducts',{products:all})
})

}

function Product (single) {
this.name = single.name;
this.price = single.price;
this.image = single.image_link;
this.description = single.description;
}

function addData (req,res) {
    let selected = req.body;
    let sql = `Insert INTO product (name,image,price,description) VALUES ($1,$2,$3,$4) RETURNING *;`
    let safeValues = [selected.name,selected.image,selected.price,selected.description];
    client.query(sql,safeValues)
    .then(data => {
        res.render('add', {added: data.rows[0]})
    })
}


function renderCart (req,res) {
    let sql = 'select * from product;'
    client.query(sql)
    .then (data => {
        let bag = data.rows;
        res.render('cart', {all:[bag]})



    })
}


function handleDelete(req,res) {
    let del = req.params.id;
    let sql =  `delete from product where id = $1`
    let safevalues = [del]
    client.query(sql,safevalues)
    .then (() => 
    res.render('/index/${id}')
    
    )
}

function handleUpdate (req,res) {
    let up = req.params.id;
    let {name,price,image,description}=req.body
    let SQL='UPDATE product SET name=$1 price=$2 image=$3 description#4 WHERE=$6;';
let saveValues= [name, price, image, description, id];
client.query(SQL,saveValues).then(()=>
res.redirect(`/index/${id}`)
)

}























client.connect()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`listening on ${PORT}`)
    );
  });