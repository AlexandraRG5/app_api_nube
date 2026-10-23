require('dotenv').config();

const os = require('os');
const app = require('./app');
const Database = require('./config/Database');
const describeError = require('./utils/describeError');
const { runSetup } = require('../scripts/setup');
const { isTrue } = require('./config/dbConfig');

const PORT = Number(process.env.PORT || 3000);

function lanAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((i) => i && i.family === 'IPv4' && !i.internal)
    .map((i) => i.address);
}

async function main() {
  if (!process.env.JWT_SECRET) {
    console.error('Falta JWT_SECRET en el archivo .env (copia .env.example como .env).');
    process.exit(1);
  }

  // En Render (plan gratuito) no hay terminal: AUTO_SETUP=true crea las tablas
  // y los datos de ejemplo al arrancar (solo si faltan).
  if (isTrue(process.env.AUTO_SETUP)) {
    try {
      await runSetup(console.log);
    } catch (err) {
      console.error('No se pudo preparar la base de datos:', describeError(err));
      process.exit(1);
    }
  }

  try {
    await Database.ping();
  } catch (err) {
    console.error('No se pudo conectar a MySQL:', describeError(err));
    console.error('Revisa que MySQL esté encendido, que los datos de .env sean correctos y que hayas corrido "npm run setup".');
    process.exit(1);
  }

  // 0.0.0.0 es necesario en Render (y para que el celular llegue en red local).
  // Render define PORT automáticamente.
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API lista en http://localhost:${PORT}/api`);
    lanAddresses().forEach((ip) => console.log(`  Desde tu celular (misma red Wi-Fi): http://${ip}:${PORT}/api`));
  });
}

main();
