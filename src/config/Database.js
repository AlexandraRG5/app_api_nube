const mysql = require('mysql2/promise');
const { buildDbConfig } = require('./dbConfig');

/**
 * Acceso único a MySQL (pool de conexiones).
 * Los Modelos usan esta clase; nada más en la app habla directamente con la BD.
 */
class Database {
  static #pool = null;

  static getPool() {
    if (!Database.#pool) {
      Database.#pool = mysql.createPool({
        ...buildDbConfig().config,
        decimalNumbers: true,
        waitForConnections: true,
        connectionLimit: 5, // los planes gratuitos limitan las conexiones simultáneas
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
      });
    }
    return Database.#pool;
  }

  /** SELECT: devuelve el arreglo de filas. */
  static async query(sql, params = []) {
    const [rows] = await Database.getPool().query(sql, params);
    return rows;
  }

  /** INSERT / UPDATE / DELETE: devuelve el resultado (insertId, affectedRows...). */
  static async run(sql, params = []) {
    const [result] = await Database.getPool().query(sql, params);
    return result;
  }

  static async ping() {
    await Database.query('SELECT 1');
  }
}

module.exports = Database;
