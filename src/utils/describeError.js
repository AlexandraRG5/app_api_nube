/**
 * Devuelve un texto útil para mostrar en consola.
 * En Node 20+ los errores de conexión a "localhost" pueden llegar como un
 * AggregateError con el mensaje VACÍO; aquí se rescata el código y se da una pista.
 */
function describeError(err) {
  const inner = Array.isArray(err.errors) && err.errors.length ? err.errors[0] : null;
  const code = err.code || (inner && inner.code) || '';
  const message = err.message || (inner && inner.message) || '';

  const hints = {
    ECONNREFUSED: 'No hay un MySQL escuchando en ese host y puerto. Revisa que MySQL esté en verde en XAMPP y que DB_HOST y DB_PORT del .env sean correctos.',
    ER_ACCESS_DENIED_ERROR: 'Usuario o contraseña de MySQL incorrectos. Revisa DB_USER y DB_PASSWORD en el .env.',
    ENOTFOUND: 'No se encontró el servidor de MySQL. Revisa DB_HOST en el .env.',
    ETIMEDOUT: 'MySQL no respondió a tiempo. Revisa DB_HOST, DB_PORT y el firewall.',
    ER_BAD_DB_ERROR: 'La base de datos no existe. Créala en el panel del hosting (o corre "npm run setup" si tu usuario puede crearla).',
    ER_DBACCESS_DENIED_ERROR: 'Tu usuario no tiene permiso sobre esa base. Revisa DB_NAME y los permisos del usuario en el panel del hosting.',
    SELF_SIGNED_CERT_IN_CHAIN: 'El certificado SSL no es de confianza. Descarga el certificado CA del proveedor y ponlo en DB_SSL_CA.',
    UNABLE_TO_VERIFY_LEAF_SIGNATURE: 'No se pudo verificar el certificado SSL. Descarga el certificado CA del proveedor y ponlo en DB_SSL_CA.',
  };

  const head = [code && `[${code}]`, message].filter(Boolean).join(' ') || 'Error desconocido';
  return hints[code] ? `${head}\n  -> ${hints[code]}` : head;
}

module.exports = describeError;
