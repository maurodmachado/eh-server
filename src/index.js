const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const mercadoPagoRoute = require('./routes/mercadoPagoRoute');
const usuariosRoute = require('./routes/usuarios');
const authRoute = require('./routes/auth');
const app = express();
const conectarDB = require("./config/db");

app.use(cors())

conectarDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/checkout', mercadoPagoRoute);
app.use("/usuarios", usuariosRoute);
app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Apis de MERN SAT Probando");
});

app.listen(process.env.PORT || 5000, () =>{  
  console.log('Server on 4000');
})

module.exports = app;