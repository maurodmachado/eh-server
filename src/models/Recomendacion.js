const mongoose = require("mongoose");

const RecomendacionesSchema = mongoose.Schema({
    nombre: {
        type: String,
    },
    descripcion: {
        type: String,
    },
    informacion:{
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Recomendacion", RecomendacionesSchema);
