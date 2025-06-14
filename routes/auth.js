const express = require('express');
const { check } = require('express-validator');
const { fieldValidator } = require('../middlewares/fieldValidator');
const router = express.Router();

const { registerUser, loginUser, renewToken } = require('../controllers/auth');
const { jwtValidator } = require('../middlewares/jwtValidator');

router.post(
    '/register',
    [
        check('name', 'El nombre es obligatorio').notEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check(
            'password',
            'La contraseña debe tener al menos 6 caracteres'
        ).isLength({ min: 6 }),
        fieldValidator,
    ],
    registerUser
);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check(
            'password',
            'La contraseña debe tener al menos 6 caracteres'
        ).isLength({ min: 6 }),
        fieldValidator,
    ],
    loginUser
);

router.get('/renew', [jwtValidator], renewToken);

module.exports = router;
