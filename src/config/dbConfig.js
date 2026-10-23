const fs = require('fs');
const path = require('path');

const isTrue = (v) => ['1', 'true', 'yes', 'on'].includes(String(v || '').toLowerCase());

/**
 * Arma las opciones de conexión a MySQL a partir de variables de entorno.
 *
 * Dos formas de configurarlo (elige UNA):
 *   1) Variables sueltas: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME  (recomendado)
 *   2) Una sola URL:      DATABASE_URL=mysql://usuario:clave@host:3306/nombre_bd
 *
 * Para bases en la nube que exigen conexión segura, agrega DB_SSL=true.
 */
function buildDbConfig({ withDatabase = true } = {}) {
  let host = process.env.DB_HOST || '127.0.0.1';
  let port = Number(process.env.DB_PORT || 3306);
  let user = process.env.DB_USER || 'root';
  let password = process.env.DB_PASSWORD || '';
  let database = process.env.DB_NAME || 'roles_app';
  let useSsl = isTrue(process.env.DB_SSL);

  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    host = url.hostname;
    if (url.port) port = Number(url.port);
    user = decodeURIComponent(url.username);
    password = decodeURIComponent(url.password);
    const dbFromUrl = decodeURIComponent(url.pathname.replace(/^\//, ''));
    if (dbFromUrl) database = dbFromUrl;
    if (url.searchParams.has('ssl-mode') || isTrue(url.searchParams.get('ssl'))) useSsl = true;
  }

  const config = { host, port, user, password, charset: 'utf8mb4' };
  if (withDatabase) config.database = database;

  if (useSsl) {
    config.ssl = {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
    };
    if (process.env.DB_SSL_CA) {
      config.ssl.ca = fs.readFileSync(path.resolve(process.env.DB_SSL_CA), 'utf8');
    }
  }

  return { config, database };
}

module.exports = { buildDbConfig, isTrue };
