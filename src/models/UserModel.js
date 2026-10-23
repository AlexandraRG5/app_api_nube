const Database = require('../config/Database');

const PUBLIC_COLUMNS = 'id, username, email, firstname, lastname, phone';

/** Modelo de usuarios: único lugar con SQL de la tabla `users`. */
class UserModel {
  static findAll() {
    return Database.query(`SELECT ${PUBLIC_COLUMNS} FROM users ORDER BY id`);
  }

  static async findById(id) {
    const rows = await Database.query(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  /** Incluye password_hash: solo para verificar el login. */
  static async findByUsername(username) {
    const rows = await Database.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] || null;
  }

  static async usernameOrEmailTaken(username, email) {
    const rows = await Database.query(
      'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
      [username, email]
    );
    return rows.length > 0;
  }

  static async create({ username, email, passwordHash, firstname, lastname, phone }) {
    const result = await Database.run(
      `INSERT INTO users (username, email, password_hash, firstname, lastname, phone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, passwordHash, firstname, lastname, phone || '']
    );
    return UserModel.findById(result.insertId);
  }
}

module.exports = UserModel;
