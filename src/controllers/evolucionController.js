const Usuario = require("../models/Usuario");
const Evolucion = require("../models/Evolucion");
const jwt = require('jsonwebtoken');

exports.getEvoluciones = async (req, res) => {
  const { token } = req.body;
  let usuario;
  jwt.verify(token, process.env.SECRETA, (err, decoded) => {      
    if (err) {
      return res.json({ mensaje: 'Token inválida' });    
    } else {
      usuario = decoded.user._id
    }
  }
  );
  try {
    let evolucion = await Evolucion.find({usuario: usuario}).select('-usuario').select('-_id');
    if (!evolucion) {
      return []
    }else{
      return res.status(200).json(evolucion);   
    }
  } catch (error) {
    return res.status(200).json(error);
  }
}

exports.crearEvolucion = async (req, res) => {
  const { token, peso, contCinMin, contCinMax, contBrazoCont, contCadera, nivelAnsiedad } = req.body;
  let usuario;
  jwt.verify(token, process.env.SECRETA, (err, decoded) => {      
    if (err) {
      return res.json({ mensaje: 'Token inválida' });    
    } else {
      usuario = decoded.user._id
    }
  }
  );
  try {
    let user = await Usuario.findById(usuario);
    if (!user) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }
    let evolucion = new Evolucion({usuario:user._id, peso, cintura_min: contCinMin, cintura_max: contCinMax, brazo: contBrazoCont, cadera: contCadera, nivel_ansiedad: nivelAnsiedad});
    await evolucion.save();
    res.status(200).json({status: 200, msg: "Evolución creada con exito", evolucion});
      
  } catch (error) {
    res.status(400).send("Hubo un error");
  }
};

