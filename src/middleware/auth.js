const jwt = require('jsonwebtoken');
const HttpError = require('../utils/HttpError');
const { roleFromUserId } = require('../utils/roles');

/** Exige un token válido ("Authorization: Bearer <token>") y deja el usuario en req.user. */
function authenticate(req, res, next) {
  const [type, token] = (req.headers.authorization || '').split(' ');
  if (type !== 'Bearer' || !token) {
    return next(new HttpError(401, 'Token requerido.'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const id = Number(payload.sub);
    // El rol se recalcula desde el id; no se confía en lo que diga el token.
    req.user = { id, username: payload.username, role: roleFromUserId(id) };
    return next();
  } catch (_) {
    return next(new HttpError(401, 'Token inválido o expirado.'));
  }
}

/** Solo deja pasar a los roles indicados (US06/US07/US08: bloqueo real en el servidor). */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new HttpError(403, 'No cuentas con permisos para realizar esta acción.'));
    }
    return next();
  };
}

module.exports = { authenticate, requireRole };
