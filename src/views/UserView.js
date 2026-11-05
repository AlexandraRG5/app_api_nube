const { roleFromUserId } = require('../utils/roles');

/** "Vista" de la API: decide cómo se ve un usuario en el JSON (nunca expone la contraseña). */
class UserView {
  static render(user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: { firstname: user.firstname, lastname: user.lastname },
      phone: user.phone,
      role: roleFromUserId(user.id),
      address: UserView.renderAddress(user),
    };
  }

  /**
   * Objeto anidado "address" -> "geolocation". Si el usuario no tiene dirección
   * se devuelve null (la app lo maneja sin romperse; US11).
   */
  static renderAddress(u) {
    const hasGeo = u.lat != null && u.lng != null;
    if (!u.city && !u.street && !u.street_number && !u.zipcode && !hasGeo) return null;
    return {
      city: u.city ?? '',
      street: u.street ?? '',
      number: u.street_number ?? '',
      zipcode: u.zipcode ?? '',
      geolocation: hasGeo ? { lat: Number(u.lat), long: Number(u.lng) } : null,
    };
  }

  static renderList(users) {
    return users.map(UserView.render);
  }
}

module.exports = UserView;
