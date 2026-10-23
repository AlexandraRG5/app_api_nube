const Database = require('../config/Database');

const MAX_QUANTITY = 99;

/** Modelo del carrito: único lugar con SQL de las tablas `carts` y `cart_items`. */
class CartModel {
  /** Devuelve el id del carrito del usuario; si no tiene, lo crea. */
  static async getOrCreateCartId(userId) {
    const result = await Database.run(
      'INSERT INTO carts (user_id) VALUES (?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)',
      [userId]
    );
    return result.insertId;
  }

  static async findCart(cartId) {
    const rows = await Database.query('SELECT id, user_id, updated_at FROM carts WHERE id = ?', [cartId]);
    return rows[0] || null;
  }

  static getItems(cartId) {
    return Database.query(
      `SELECT ci.product_id, ci.quantity, p.title, p.price, p.image
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = ?
       ORDER BY ci.id`,
      [cartId]
    );
  }

  static async itemExists(cartId, productId) {
    const rows = await Database.query(
      'SELECT id FROM cart_items WHERE cart_id = ? AND product_id = ? LIMIT 1',
      [cartId, productId]
    );
    return rows.length > 0;
  }

  /**
   * Agrega el artículo; si ya existe en el carrito NO duplica el registro,
   * suma la cantidad (US09, Escenario 2).
   */
  static async addItem(cartId, productId, quantity) {
    await Database.run(
      `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = LEAST(quantity + ?, ?)`,
      [cartId, productId, quantity, quantity, MAX_QUANTITY]
    );
    await CartModel.touch(cartId);
  }

  /** Devuelve false si el artículo no está en el carrito. */
  static async setQuantity(cartId, productId, quantity) {
    if (!(await CartModel.itemExists(cartId, productId))) return false;
    await Database.run('UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?', [
      quantity,
      cartId,
      productId,
    ]);
    await CartModel.touch(cartId);
    return true;
  }

  /** Devuelve true si se eliminó el artículo. */
  static async removeItem(cartId, productId) {
    const result = await Database.run('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [
      cartId,
      productId,
    ]);
    await CartModel.touch(cartId);
    return result.affectedRows > 0;
  }

  static async clear(cartId) {
    await Database.run('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    await CartModel.touch(cartId);
  }

  static async touch(cartId) {
    await Database.run('UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [cartId]);
  }
}

CartModel.MAX_QUANTITY = MAX_QUANTITY;
module.exports = CartModel;
