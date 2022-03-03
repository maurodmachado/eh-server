const Recomendacion = require("../models/Recomendacion");

exports.getRecomendacion = async (req, res) => {
  try {
    let reco = await Recomendacion.findById(req.params.id)
    if (!reco) {
      res.status(404).json({msg:"La recomendación no existe"})
    }else{
      res.status(200).json(reco)
    }
  } catch (error) {
    res.status(400).json({msg: "Error al obtener recomendación"})
  }
}

exports.getRecomendaciones = async (req, res) => {
  try {
    let recomendaciones = await Recomendacion.find()
    if (!recomendaciones) {
      res.status(404).json({msg:"No hay recomendaciones cargadas"})
    }else{
      res.status(200).json(recomendaciones)
    }
  } catch (error) {
    res.status(400).json({msg: "Error al obtener recomendaciones"})
  }
}

exports.crearRecomendacion = async (req, res) => {
  try {
    const reco = new Recomendacion(req.body);    
    const recoCreada = await reco.save();
    res.status(200).json(recoCreada);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.eliminarRecomendacion = async (req, res) => {
  try {
    let reco = await Recomendacion.findById(req.params.id);
    if (!reco) {
      return res.status(404).json({ msg: "Recomendación no encontrada" });
    }
    await Recomendacion.findOneAndRemove({ _id: req.params.id });
    res.status(200).json({ msg: "Recomendación eliminada" });
  } catch (error) {
    res.status(500).send("Hubo un error");
  }
};

exports.modificarRecomendacion = async (req, res) => {
  const { nombre, descripcion, informacion } = req.body;
  const nuevaReco = {};
  if (nombre) {
    nuevaReco.nombre = nombre;
  }
  if (descripcion) {
    nuevaReco.descripcion = descripcion;
  }
  if(informacion) {
    nuevaReco.informacion = informacion;
  }
  try {
    let reco = await Recomendacion.findById(req.params.id);
    if (!reco) {
      return res.status(404).json({ msg: "Recomendacion no encontrada" });
    }
    reco = await Recomendacion.findOneAndUpdate(
      { _id: req.params.id },
      { $set: nuevaReco },
      { new: true }
    );
    res.json({ reco });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
