const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getUser = async (req, res) => {
  try {
    let usuario = await Usuario.findById(req.params.id).populate('recomendacion').populate('plan');
    if (!usuario) {
      res.status(404).json({msg:"El usuario no existe"})
    }else{
      res.status(200).json(usuario)
    }
  } catch (error) {
    res.status(400).json({msg: "Error al obtener usuario"})
  }
}

exports.getUsers = async (req, res) => {
  try {
    let usuarios = await Usuario.find().populate('plan').populate('recomendacion');
    if (!usuarios) {
      return {msg:"No hay usuarios cargados"}
    }else{
      res.status(200).json(usuarios);
    }
  } catch (error) {
    res.status(400).json({msg: "Error al obtener usuarios"});
  }
}

exports.crearUsuario = async (req, res) => {
  const { usuario, password, status, plan, recomendacion } = req.body;
  try {
    let user = await Usuario.exists({ usuario });
    if(user){
      return res.status(404).json({error:'Usuario ya existente'})
    }
    user = new Usuario(req.body);
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);
    user.plan = plan;
    user.status = status;
    user.recomendacion = recomendacion;
    const usuarioCreado = await user.save();
    const payload = { user };
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 36000,
      },
      (error, token) => {
        if (error) throw error;
        res.status(200).json({ usuarioCreado, token });
      }
    );
  } catch (error) {
    res.status(400).json({msg: "Error al crear usuario"});
  }
};


exports.actualizarContra = async (req,res) => {
  
      const {user_id, new_password} = req.body;
      const nuevoUsuario = {};
      const salt = await bcryptjs.genSalt(10);
      nuevoUsuario.password = await bcryptjs.hash(new_password, salt);
      try {
        let user = await Usuario.findById(user_id);
        if (!user) {
          return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        user = await Usuario.findOneAndUpdate(
          { _id: user_id },
          { $set: nuevoUsuario },
          { new: true }
        );
        res.json({  msg: "Contraseña actualizada" });
      } catch (error) {
        res.status(500).send("Hubo un error");
      }

}

exports.actualizarUsuario = async (req, res) => {
  const { usuario, password, dni, status, plan, recomendacion } = req.body;
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
  if(status){
  nuevoUsuario.status = status;
  }
  if(recomendacion){
  nuevoUsuario.recomendacion = recomendacion;
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
