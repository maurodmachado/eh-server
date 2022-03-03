const Informacione = require("../models/Informacione");

exports.getInfo = async (req, res) => {
  try {
    let info = await Informacione.find()
    if (!info) {
      res.status(404).json({msg:"No hay info cargada"})
    }else{
      res.status(200).json(info)
    }
  } catch (error) {
    res.status(400).json({msg: "Error al obtener info"})
  }
}

exports.modificarInfo = async (req, res) => {
  const {infoNosotros, objetivosText1, objetivosTitle1, objetivosText2, objetivosTitle2, sloganTitle, sloganText, telefono, instagram } = req.body;
  const nuevaInfo = {};
  if (infoNosotros) {
    nuevaInfo.infoNosotros = infoNosotros;
  }
  if (objetivosText1) {
    nuevaInfo.objetivosText1 = objetivosText1;
  }
  if(objetivosTitle1) {
    nuevaInfo.objetivosTitle1 = objetivosTitle1;
  }
  if(objetivosText2){
    nuevaInfo.objetivosText2 = objetivosText2;
  }
  if(objetivosTitle2){
    nuevaInfo.objetivosTitle2 = objetivosTitle2;
  }
  if(sloganTitle){
    nuevaInfo.sloganTitle = sloganTitle;
  }
  if(sloganText){
    nuevaInfo.sloganText = sloganText;
  }
  if(telefono){
    nuevaInfo.telefono = telefono;
  }
  if(instagram){
    nuevaInfo.instagram = instagram;
  }
  try {
    let info = await Informacione.findById(req.params.id);
    if (!info) {
      return res.status(404).json({ msg: "Información no encontrada" });
    }
    info = await Informacione.findOneAndUpdate(
      { _id: req.params.id },
      { $set: nuevaInfo },
      { new: true }
    );
    res.json({ info });
  } catch (error) {
    res.status(500).send("Hubo un error");
  }
};
