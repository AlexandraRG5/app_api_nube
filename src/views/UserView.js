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
    };
  }

  static renderList(users) {
    return users.map(UserView.render);
  }
}

module.exports = UserView;
