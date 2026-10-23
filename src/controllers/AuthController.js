const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const UserView = require('../views/UserView');
const HttpError = require('../utils/HttpError');

class AuthController {
  /** POST /api/auth/login  { username, password } -> { token, user } (US01) */
  static async login(req, res) {
    const { username, password } = req.body || {};
    if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
      throw new HttpError(400, 'Usuario y contraseña son obligatorios.');
    }

    const user = await UserModel.findByUsername(username.trim());
    const valid = user && (await bcrypt.compare(password, user.password_hash));
    if (!valid) {
      throw new HttpError(401, 'Usuario o contraseña inválidos');
    }

    const token = jwt.sign({ sub: String(user.id), username: user.username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });

    res.json({ token, user: UserView.render(user) });
  }
}

module.exports = AuthController;
