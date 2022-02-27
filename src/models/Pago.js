const mongoose = require("mongoose");

const PagosSchema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    amount: {
        type: String,
    },
    status: {
        type: String,
        default: 'unpay'
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    },
    fechaPago: {
        type: String,
        default: Date.now().toLocaleString(),
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Pago", PagosSchema);
