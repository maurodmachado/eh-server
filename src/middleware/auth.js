const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No hay token, permiso no válido" });
  }
  try {
    const cifrado = jwt.verify(token,process.env.SECRETA);
    console.log(cifrado);
    if(cifrado.user.isAdmin === true){
      next();
    }else{
      res.status(401).json({ msg: "Token sin autorizacion para esto" });
    }
  } catch (error) {
    res.status(401).json({ msg: "Token no válido" });
  }
};
