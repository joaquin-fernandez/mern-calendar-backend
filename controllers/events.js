const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async (req, res = response) => {
    try {
        const events = await Event.find({ user: req.uid }).populate(
            'user',
            'name'
        );
        res.json({
            ok: true,
            events,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los eventos',
        });
    }
};

const createEvent = async (req, res = response) => {
    const event = new Event(req.body);
    try {
        event.user = req.uid;
        const savedEvent = await event.save();
        res.json({
            ok: true,
            event: savedEvent,
            msg: 'Evento creado',
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el evento',
        });
    }
};

const updateEvent = async (req, res = response) => {
    const eventId = req.params.id;

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no encontrado',
            });
        }

        if (event.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permisos para editar este evento',
            });
        }

        const newEvent = {
            ...req.body,
            user: req.uid,
        };

        const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
            new: true,
        });

        res.json({
            ok: true,
            event: updatedEvent,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al modificar el evento',
        });
    }
};

const deleteEvent = async (req, res = response) => {
    const eventId = req.params.id;

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no encontrado',
            });
        }

        if (event.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permisos para editar este evento',
            });
        }

        await Event.findByIdAndDelete(eventId);

        res.json({
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el evento',
        });
    }
};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
};
