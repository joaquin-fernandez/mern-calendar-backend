const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const registerUser = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo',
            });
        }

        user = new User(req.body);

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();
        const token = await generateJWT(user._id, user.name);

        res.status(201).json({
            ok: true,
            uid: user._id,
            name: user.name,
            token,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con un administrador',
        });
    }
};

const loginUser = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe',
            });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta',
            });
        }

        const token = await generateJWT(user._id, user.name);

        res.json({
            ok: true,
            uid: user._id,
            name: user.name,
            token,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con un administrador',
        });
    }
};

const renewToken = async (req, res = response) => {
    const { uid, name } = req;

    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token,
    });
};

module.exports = {
    registerUser,
    loginUser,
    renewToken,
};
