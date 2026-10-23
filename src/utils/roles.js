/**
 * Regla de negocio de roles (la misma que usa la app móvil):
 *  - id 1 y 2 -> administrador
 *  - id 3     -> auditor
 *  - el resto -> cliente
 */
const ROLES = Object.freeze({
  ADMIN: 'administrador',
  AUDITOR: 'auditor',
  CLIENT: 'cliente',
});

function roleFromUserId(id) {
  if (id === 1 || id === 2) return ROLES.ADMIN;
  if (id === 3) return ROLES.AUDITOR;
  return ROLES.CLIENT;
}

module.exports = { ROLES, roleFromUserId };
