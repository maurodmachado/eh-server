const mongoose = require("mongoose");

const InformacionSchema = mongoose.Schema({
    infoNosotros:{
        type: String,
    },
    objetivosText1:{
        type: String,
    },
    objetivosTitle1:{
        type: String,
    },
    objetivosText2:{
        type: String,
    },
    objetivosTitle2:{
        type: String,
    },
    sloganTitle:{
        type: String,
    },
    sloganText:{
        type: String,
    },
    telefono:{
        type: String,
    },
    instagram:{
        type: String,
    }
});

module.exports = mongoose.model("Informacione", InformacionSchema);
