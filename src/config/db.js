const mongoose = require("mongoose");

require("dotenv").config({ path: "variables.env" });

const conectarDB = async () => {
    try {
        //await mongoose.connect("mongodb://localhost:27017,localhost:27018,localhost:27019/merntask", { useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: false, replicaSet: 'rs' })
        await mongoose.connect(process.env.DB_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            replicaSet: "rs",
            useCreateIndex: true,
        });
        console.log("Base de datos : \x1b[32m%s\x1b[0m ", "conectada");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = conectarDB;
