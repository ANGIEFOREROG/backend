const express = require('express');
const userModel = require('../dao/models/users.model');

const usersRouter = express.Router();

usersRouter
    .get('/', async (request, response) => {
        try {
        const users = await userModel.find({ isActive: true });
        response.json({
            status: 'success',
            result: users
        });
        } catch (error) {
        console.error(error);
        response.status(500).send('Error al obtener los usuarios');
        }
    })
    .post('/', async (request, response) => {
        try {
        const { body } = request;
        const newUser = await userModel.create(body);
        response.json({
            status: 'success',
            result: newUser
        });
        } catch (error) {
        console.error(error);
        response.status(500).send('Error al crear el usuario');
        }
    })
    .get('/:uid', async (request, response) => {
        try {
        const { uid } = request.params;
        const user = await userModel.findOne({ _id: uid });
        if (!user) {
            return response.status(404).send('Usuario no encontrado');
        }
        response.json({
            status: 'success',
            result: user
        });
        } catch (error) {
        console.error(error);
        response.status(500).send('Error al obtener el usuario');
        }
    })
    .put('/:uid', async (request, response) => {
        try {
        const { uid } = request.params;
        const updatedUser = await userModel.findByIdAndUpdate(uid, request.body, { new: true });
        response.json({
            status: 'success',
            result: updatedUser
        });
        } catch (error) {
        console.error(error);
        response.status(500).send('Error al actualizar el usuario');
        }
    })
    .delete('/:uid', async (request, response) => {
        try {
        const { uid } = request.params;
        await userModel.findByIdAndUpdate(uid, { isActive: false });
        response.send('Usuario eliminado (desactivado) correctamente');
        } catch (error) {
        console.error(error);
        response.status(500).send('Error al eliminar el usuario');
        }
    });

module.exports = usersRouter;