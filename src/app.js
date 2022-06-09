
const express = require('express')
const morgan = require('morgan');
const cors = require('cors')
const path  = require('path');
const config = require('./config');
const routes = require('./routes/route');
const { port } = config;
const app = express() 

// Middlewares
app.use(cors())
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Settings
app.set("port", port); //Mensetup port
app.set("views", path.join(__dirname, "views")); //Mensetup folder views 
app.set("view engine", ".ejs"); //Mesetup templating engine EJS
app.use(express.static(path.join(__dirname, "public")));  //Mendeklarasikan folder public 

// Routes
app.use(routes); //GUnakan rute yang dibuat
app.use((req, res, next) => {
  res.status(404).render('error'); //Error
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
