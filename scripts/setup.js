/**
 * Prepara la base de datos: (si puede) la crea, crea las tablas
 * y carga datos de ejemplo SOLO si las tablas están vacías.
 *
 * Uso manual:  npm run setup
 * Automático:  con AUTO_SETUP=true el servidor lo ejecuta al arrancar
 *              (útil en Render, donde no hay terminal en el plan gratuito).
 *
 * Es seguro ejecutarlo varias veces: no duplica ni borra datos.
 */
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { users, products } = require('./seedData');
const { buildDbConfig } = require('../src/config/dbConfig');
const describeError = require('../src/utils/describeError');

async function runSetup(log = console.log) {
  const { config, database } = buildDbConfig({ withDatabase: false });
  const conn = await mysql.createConnection({ ...config, multipleStatements: true });

  try {
    // En hostings como Always Data la base se crea desde el panel y el usuario
    // no tiene permiso de CREATE DATABASE: en ese caso se usa la que ya existe.
    try {
      await conn.query(
        `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
      );
    } catch (err) {
      log(`Aviso: no se pudo crear la base "${database}" (${err.code || err.message}); se usará la existente.`);
    }
    await conn.query(`USE \`${database}\``);

    const schema = fs.readFileSync(path.join(__dirname, '..', 'sql', 'schema.sql'), 'utf8');
    await conn.query(schema);
    log('Tablas listas.');

    const [[{ total: userCount }]] = await conn.query('SELECT COUNT(*) AS total FROM users');
    if (userCount === 0) {
      // Ids explícitos 1..N: la regla de roles depende de ellos
      // (1 y 2 = administrador, 3 = auditor, el resto = cliente).
      for (let i = 0; i < users.length; i += 1) {
        const u = users[i];
        await conn.query(
          `INSERT INTO users (id, username, email, password_hash, firstname, lastname, phone)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [i + 1, u.username, u.email, bcrypt.hashSync(u.password, 10), u.firstname, u.lastname, u.phone]
        );
      }
      log(`Usuarios de ejemplo insertados: ${users.length}`);
    } else {
      log('La tabla users ya tiene datos: no se insertó nada.');
    }

    const [[{ total: productCount }]] = await conn.query('SELECT COUNT(*) AS total FROM products');
    if (productCount === 0) {
      for (const p of products) {
        const [cat] = await conn.query(
          'INSERT INTO categories (name) VALUES (?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)',
          [p.category]
        );
        await conn.query(
          `INSERT INTO products (title, price, description, image, category_id, rating, rating_count)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [p.title, p.price, p.description, p.image, cat.insertId, p.rating, p.count]
        );
      }
      log(`Productos de ejemplo insertados: ${products.length}`);
    } else {
      log('La tabla products ya tiene datos: no se insertó nada.');
    }

    log(`Listo. Base de datos "${database}" preparada.`);
  } finally {
    await conn.end();
  }
}

module.exports = { runSetup };

if (require.main === module) {
  runSetup().catch((err) => {
    console.error('Error en setup:', describeError(err));
    process.exit(1);
  });
}
