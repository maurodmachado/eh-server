const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Plan = require('../models/Plan');

exports.autenticarUsuario = async (req, res) => {
    const {usuario, password} = req.body;
    try {
        let user = await Usuario.findOne({usuario})
        if(!user){
            return res.status(400).json({ msg: 'El usuario no existe'})
        }
        
        const passCorrecto = await bcryptjs.compare(password, user.password);
        if(!passCorrecto){
            return res.status(400).json({ msg: 'Password incorrecta'})
        }
        let planCompleto = await Plan.findById(user.plan)
        let userSend = { 
            status: user.status,
            isAdmin: user.isAdmin,
            _id: user._id,
            usuario: user.usuario,
            plan: planCompleto
        }
        const payload = { user: userSend };
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 36000
        }, async (error, token) => {
            if (error) throw error;         
            //Mensaje de confirmacion
            await res.status(200).send({token});
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.usuarioAutenticado = async (req,res) => {
    try {
        const usuario = await Usuario.findById(req.user.id).select('-password');
        res.status(200).json({usuario});
    } catch (error) {
        res.status(500).json({msg: 'Hubo un error'})
    }

}

