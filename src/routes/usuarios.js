const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const auth = require("../middleware/auth");

router.post("/", auth, usuarioController.crearUsuario);

router.get("/", auth, usuarioController.getUsers);

router.put("/:id", auth, usuarioController.actualizarUsuario);

router.delete("/:id", auth, usuarioController.eliminarUsuario);

router.put("/", auth, usuarioController.actualizarContra);

module.exports = router;
