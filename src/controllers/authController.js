const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    const {usuario, password} = req.body;
    try {
        let user = await Usuario.findOne({usuario}).
        populate({ path: 'alumnos',
        // Get friends of friends - populate the 'friends' array for every friend
        populate: { path: 'persona' } })
        
        if(!user){
            return res.status(400).json({ msg: 'El usuario no existe'})
        }
        
        const passCorrecto = await bcryptjs.compare(password, user.password);
        if(!passCorrecto){
            return res.status(400).json({ msg: 'Password incorrecta'})
        }
        const payload = {
            user: {
                id: user.id
            }
        };
        
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, async (error, token) => {
            if (error) throw error;         
            //Mensaje de confirmacion
            await res.status(200).send({token, user});
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