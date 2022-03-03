const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Plan = require("../models/Plan");

exports.getPlan = async (req, res) => {
  try {
    let plan = await Plan.findById(req.params.id)
    if (!plan) {
      res.status(404).json({msg:"El plan no existe"})
    }else{
      res.status(200).json(plan)
    }
  } catch (error) {
    res.status(400).json({msg: "Error al obtener plan"})
  }
}

exports.getPlanes = async (req, res) => {
  try {
    let planes = await Plan.find()
    if (!planes) {
      res.status(404).json({msg:"No hay planes cargados"})
    }else{
      res.status(200).json(planes)
    }
  } catch (error) {
    res.status(400).json({msg: "Error al obtener plan"})
  }
}
exports.crearPlan = async (req, res) => {
  try {
    const plan = new Plan(req.body);    
    const planCreado = await plan.save();
    res.status(200).json(planCreado);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.eliminarPlan = async (req, res) => {
  try {
    let plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ msg: "Plan no encontrado" });
    }
    await Plan.findOneAndRemove({ _id: req.params.id });
    res.status(200).json({ msg: "Plan eliminado" });
  } catch (error) {
    res.status(500).send("Hubo un error");
  }
};

exports.editarPlan = async (req, res) => {
  const {nombre, descripcion_corta, descripcion_larga, nivel, precio, rutina, desafio, recomendaciones, status} = req.body;
  const nuevoPlan = {};
  nuevoPlan.nombre = nombre;
  nuevoPlan.descripcion_corta = descripcion_corta;
  nuevoPlan.descripcion_larga = descripcion_larga;
  nuevoPlan.nivel = nivel;
  nuevoPlan.precio = precio;
  nuevoPlan.rutina = rutina;
  nuevoPlan.desafio = desafio;
  nuevoPlan.recomendaciones = recomendaciones;
  nuevoPlan.status = status;
  try {
    let plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ msg: "Plan no encontrado" });
    }
    plan = await Plan.findOneAndUpdate(
      { _id: req.params.id },
      { $set: nuevoPlan },
      { new: true }
    );
    res.json({ plan });
  } catch (error) {
    res.status(500).send("Hubo un error");
  }
};
