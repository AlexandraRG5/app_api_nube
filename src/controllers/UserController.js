const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');
const UserView = require('../views/UserView');
const HttpError = require('../utils/HttpError');

const isText = (v) => typeof v === 'string' && v.trim().length > 0;

class UserController {
  /** GET /api/users -> lista de usuarios */
  static async index(req, res) {
    res.json(UserView.renderList(await UserModel.findAll()));
  }

  /** GET /api/users/:id */
  static async show(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) throw new HttpError(400, 'ID inválido.');

    const user = await UserModel.findById(id);
    if (!user) throw new HttpError(404, 'Usuario no encontrado.');
    res.json(UserView.render(user));
  }

  /** POST /api/users -> agrega un usuario (contraseña guardada con hash) */
  static async store(req, res) {
    const { username, email, password, firstname, lastname, phone } = req.body || {};

    if (![username, email, password, firstname, lastname].every(isText)) {
      throw new HttpError(400, 'username, email, password, firstname y lastname son obligatorios.');
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new HttpError(400, 'El email no tiene un formato válido.');
    if (password.length < 6) throw new HttpError(400, 'La contraseña debe tener al menos 6 caracteres.');

    if (await UserModel.usernameOrEmailTaken(username.trim(), email.trim())) {
      throw new HttpError(409, 'El usuario o el email ya existen.');
    }

    const created = await UserModel.create({
      username: username.trim(),
      email: email.trim(),
      passwordHash: await bcrypt.hash(password, 10),
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      phone: typeof phone === 'string' ? phone.trim() : '',
    });
    res.status(201).json(UserView.render(created));
  }
}

module.exports = UserController;
