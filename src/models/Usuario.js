const mongoose = require("mongoose");

const UsuariosSchema = mongoose.Schema({
    usuario: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        default: 'INACTIVO'
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    },
    recomendacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recomendacion'
    },
    isAdmin: {
        type: Boolean,
        default: false
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

module.exports = mongoose.model("Usuario", UsuariosSchema);
