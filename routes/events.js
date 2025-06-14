const express = require('express');
const { check } = require('express-validator');
const { fieldValidator } = require('../middlewares/fieldValidator');
const router = express.Router();
const { isDate } = require('../helpers/isDate');
const { jwtValidator } = require('../middlewares/jwtValidator');
const {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/events');

router.use(jwtValidator);

//Obtener todos los eventos
router.get('/', getEvents);

//Crear un evento
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').notEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom(isDate),
        check('end', 'La fecha de fin es obligatoria').custom(isDate),
        fieldValidator,
    ],
    createEvent
);

//Modificar un evento
router.put('/:id', updateEvent);

//Eliminar un evento
router.delete('/:id', deleteEvent);

module.exports = router;
