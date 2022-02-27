const mongoose = require("mongoose");

const PlanesSchema = mongoose.Schema({
    nombre: {
        type: String,
    },
    descripcion_corta: {
        type: String,
    },
    descripcion_larga: {
        type: String,
    },
    nivel: {
        type: String,
    },
    rutina: {
        type: String,
    },
    desafio: {
        type: String,
    },
    recomendaciones: {
        type: String,
    },
    precio: {
        type: String,
    },
    status: {
        type: String,
        default: "INACTIVO"
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    linkPago:{
        type: String,
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Plan", PlanesSchema);
