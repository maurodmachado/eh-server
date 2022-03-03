const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const mercadoPagoRoute = require('./routes/mercadoPagoRoute');
const usuariosRoute = require('./routes/usuarios');
const evolucionesRoute = require('./routes/evolucionesRoute');
const planesRoute = require('./routes/planesRoute');
const informacionRoute = require('./routes/informacionRoute');
const recomendacionRoute = require('./routes/recomendacionRoute');
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
app.use("/evoluciones", evolucionesRoute);
app.use("/planes", planesRoute);
app.use("/informacion", informacionRoute);
app.use("/recomendaciones", recomendacionRoute);

app.get("/", (req, res) => {
  res.send("API EH");
});

app.listen(process.env.PORT || 4000, () =>{  
  console.log('Server on 4000');
})

module.exports = app;