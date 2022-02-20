const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getUser = async ({plan}) => {
  const user = 'ehplan'+plan;
  try {
    let usuario = await Usuario.findOne({usuario:user})
    if (!usuario) {
      return {msg:"El usuario no existe"}
    }else{
      return usuario
    }
  } catch (error) {
    return {error: error}
  }
}

exports.crearUsuario = async (req, res) => {
  const { usuario, password, status, plan } = req.body;
  try {
    let user = await Usuario.exists({ usuario });
    if (user) {
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.SECRETA,
        {
          expiresIn: 3600,
        },
        (error, token) => {
          if (error) throw error;
          res.status(200).json({ user, token });
        }
      );
    }
    user = new Usuario(req.body);
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);
    user.plan = plan
    user.status = status
    const usuarioCreado = await user.save();
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;
        console.log('Usuario Creado');
        res.status(200).json({ usuarioCreado, token });
      }
    );
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.actualizarUsuario = async (req, res) => {
  const { usuario, password, dni, status, plan } = req.body;
  const nuevoUsuario = {};
  if (usuario) {
    nuevoUsuario.usuario = usuario;
  }
  if (password) {
    const salt = await bcryptjs.genSalt(10);
    nuevoUsuario.password = await bcryptjs.hash(password, salt);
  }
  if(dni) {
    nuevoUsuario.dni = dni;
  }
  if(plan){
    nuevoUsuario.plan = plan;
  }
  if(plan){
  nuevoUsuario.status = status;
  }
  try {
    let user = await Usuario.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    user = await Usuario.findOneAndUpdate(
      { _id: req.params.id },
      { $set: nuevoUsuario },
      { new: true }
    );
    res.json({ user });
  } catch (error) {
    res.status(500).send("Hubo un error");
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    let user = await Usuario.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    await Usuario.findOneAndRemove({ _id: req.params.id });
    res.status(200).json({ msg: "Usuario eliminado" });
  } catch (error) {
    res.status(500).send("Hubo un error");
  }
};
