

const axios = require('axios');
// {
//   "id": 1069551189,
//   "nickname": "TETE8066194",
//   "password": "qatest4825",
//   "site_status": "active",
//   "email": "test_user_8478340@testuser.com"
// }
const nodemailer = require('nodemailer');

const tokenMP = 'TEST-3236077582921193-020605-de428f18888280880e7e95ec3de225c7-282971304';

const mercadopago = require ('mercadopago');
const { getUser, crearUsuario } = require('./usuarioController');
const Pago = require('../models/Pago');
mercadopago.configure({
  access_token: tokenMP
});

exports.checkoutPro = async (req,res) => {
	let preference = {
    external_reference: "Entrená Hábitos", 
    notification_url: "https://entrena-habitos.herokuapp.com/checkout/webhook",
		items: req.body.items,
    payer:{
      name: req.body.comprador.nombres,
      surname: req.body.comprador.apellidos,
      email: req.body.comprador.email,
      identification:{
        number: req.body.comprador.dni,
        type: 'DNI'
      },
      phone:{
        area_code:  req.body.comprador.codigoArea,
        number: Number(req.body.comprador.telefono),
      },
      address:{
        zip_code: req.body.comprador.codigoPostal,
        street_name: req.body.comprador.calle,
        street_number: Number(req.body.comprador.nroCalle),
      }
    },
		back_urls: {
			"success": "https://entrenahabitos.netlify.app/aprobado",
			"failure": "https://entrenahabitos.netlify.app/rechazado",
			"pending": "https://entrenahabitos.netlify.app/pendiente"
		},
		auto_return: "approved",
	};
	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json(response.body.sandbox_init_point);
		}).catch(function (error) {
			console.log(error);
		});
};

exports.webhook = async (req, res) => {

 
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'entrenahabitos.entrenamiento@gmail.com',
      pass: 'Bianca123!'
    }
  });
  const {body} = req;
  if(body.type !== undefined){
    try {
      const response = await axios.get(`https://api.mercadopago.com/v1/payments/${req.body.data.id}`,{
     headers:{      
       'Authorization': `Bearer ${tokenMP}`,
       "Content-Type": "application/json"
     }
   });const user = response.data.payer.email;
   const {usuarioCreado} = crearUsuario({ usuario: user, password:'entrenahabitos2022', status:'ACTIVO', plan: response.data.additional_info.items[0].id })
   
   if(response.data.status_detail === "accredited"){
     try {
      const pago = new Pago({usuario: usuarioCreado._id, amount: response.data.transaction_amount, status:'pay', plan: response.data.additional_info.items[0].id});
      await pago.save();
    
    } catch (error) {
      console.log(error);
    }
    const fechaPago = new Date(response.data.date_created);
    const mailOptions = {
      from: 'entrenahabitos.entrenamiento@gmail.com',
      to: 'machadomauro.cft@gmail.com',
      subject: `Pago acreditado - ${response.data.external_reference} - ${response.data.description}`,
      html: `<b>Bienvenido a Entrena Habitos!</b><br>Tu pago de $${response.data.transaction_details.total_paid_amount} realizado el día <b>${fechaPago.toLocaleString()}</b> fue acreditado. A continuación encontraras la información para ingresar a la plataforma.<br />Tu cuenta de acceso es: <br /><b>Usuario:<b/> ${user}<br /><b>Contraseña:</b> entrenahabitos2022`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }else if(response.data.status_detail === "pending_contingency"){
    const pago = new Pago({usuario: usuarioCreado._id, amount: response.data.transaction_amount, status:'pending', plan: response.data.additional_info.items[0].id});
    await pago.save();
    const mailOptions = {
      from: 'entrenahabitos.entrenamiento@gmail.com',
      to: 'machadomauro.cft@gmail.com',
      subject: `Pago PENDIENTE - ${response.data.external_reference} - ${response.data.description}`,
      text: `Bienvenido a Entrena Habitos! Tu pago de $${response.data.transaction_details.total_paid_amount} realizado el día ${response.data.date_created} esta en estado PENDIENTE. Cuando se acredite recibirás la información necesaria para acceder a la plataforma. Muchas gracias por confiar en nosotros. Staff EH.`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

   res.json({
          status: response.data.status,
          status_detail: response.data.status_detail
        });
  //  res.json(response.data);
    } catch (error) {
      console.log(error);
    } 
  }else{     
  return res.status(400);
  }
  return res.status(201);
}

exports.getFeedback = async (req, res) => {
  try {
    const response = await axios.get(`https://api.mercadopago.com/v1/payments/${req.params.id}`,{
   headers:{      
     'Authorization': `Bearer ${tokenMP}`,
     "Content-Type": "application/json"
   }
 });
 res.json({
      Payment: {
        id: response.data.id,
        payer: {
          payer_id: response.data.payer.id,
          email: response.data.payer.email,
          dni: response.data.payer.identification.number
        }
      },
      Status: {
        status: response.data.status,
        status_detail: response.data.status_detail
      },
      MerchantOrder: response.data.order.id,
      OrderInfo: response.data.additional_info.items
    });
//  res.json(response.data);
  } catch (error) {
    console.log(error);
  } 
    
}

exports.getQR = async (req,res) => {
  
  try{
    const response = await axios.post("https://api.mercadopago.com/instore/orders/qr/seller/collectors/1070519931/pos/POS001/qrs", req.body,
     {
      headers:{      
        'Authorization': `Bearer ${tokenMP}`,
        "Content-Type": "application/json"
      }
    })
    
  const result = await axios.post("https://api.qrcode-monkey.com/qr/custom", 
   {
    "data": response.data.qr_data,
    "config": {
      "body": "square",
      "eye": "frame0",
      "eyeBall": "ball0",
      "erf1": [],
      "erf2": [],
      "erf3": [],
      "brf1": [],
      "brf2": [],
      "brf3": [],
      "bodyColor": "#000000",
      "bgColor": "#FFFFFF",
      "eye1Color": "#000000",
      "eye2Color": "#000000",
      "eye3Color": "#000000",
      "eyeBall1Color": "#000000",
      "eyeBall2Color": "#000000",
      "eyeBall3Color": "#000000",
      "gradientColor1": "",
      "gradientColor2": "",
      "gradientType": "linear",
      "gradientOnEyes": "true",
      "logo": "41b2e4d58e6c73e1461e922a1ab358949f168a7c.png",
      "logoMode": "default"
    },
    "size": 1075,
    "download": "imageUrl",
    "file": "svg"
  },{});
   res.send(result.data.imageUrl);
  }catch(e){
  console.log(e);  
  }
  
}


