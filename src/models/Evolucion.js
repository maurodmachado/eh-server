const mongoose = require("mongoose");

const EvolucionSchema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    fecha: {
        type: String,
        default: new Date().toLocaleDateString(),
    },
    peso: {
        type: String,
    },
    cintura_min: {
        type: String,
    },
    cintura_max: {
        type: String,
    },
    brazo: {
        type: String,
    },
    cadera: {
        type: String,
    },
    nivel_ansiedad: {
        type: String,
    }
});

module.exports = mongoose.model("Evolucione", EvolucionSchema);
