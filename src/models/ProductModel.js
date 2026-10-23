const Database = require('../config/Database');

const BASE_SELECT = `
  SELECT p.id, p.title, p.price, p.description, p.image,
         p.rating, p.rating_count, c.name AS category
  FROM products p
  JOIN categories c ON c.id = p.category_id`;

/** Modelo de productos y categorías: único lugar con SQL de esas tablas. */
class ProductModel {
  static findAll() {
    return Database.query(`${BASE_SELECT} ORDER BY p.id`);
  }

  static async findById(id) {
    const rows = await Database.query(`${BASE_SELECT} WHERE p.id = ?`, [id]);
    return rows[0] || null;
  }

  static findByCategory(categoryName) {
    return Database.query(`${BASE_SELECT} WHERE c.name = ? ORDER BY p.id`, [categoryName]);
  }

  static async listCategories() {
    const rows = await Database.query('SELECT name FROM categories ORDER BY name');
    return rows.map((r) => r.name);
  }

  /** Devuelve el id de la categoría; si no existe, la crea. */
  static async getOrCreateCategoryId(name) {
    const result = await Database.run(
      'INSERT INTO categories (name) VALUES (?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)',
      [name]
    );
    return result.insertId;
  }

  static async create({ title, price, description, image, category }) {
    const categoryId = await ProductModel.getOrCreateCategoryId(category);
    const result = await Database.run(
      `INSERT INTO products (title, price, description, image, category_id)
       VALUES (?, ?, ?, ?, ?)`,
      [title, price, description, image, categoryId]
    );
    return ProductModel.findById(result.insertId);
  }

  /** Devuelve el producto actualizado, o null si el id no existe. */
  static async update(id, { title, price, description, image, category }) {
    const existing = await ProductModel.findById(id);
    if (!existing) return null;

    const categoryId = await ProductModel.getOrCreateCategoryId(category);
    await Database.run(
      `UPDATE products
       SET title = ?, price = ?, description = ?, image = ?, category_id = ?
       WHERE id = ?`,
      [title, price, description, image, categoryId, id]
    );
    return ProductModel.findById(id);
  }

  /** Devuelve true si se eliminó algo. */
  static async remove(id) {
    const result = await Database.run('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = ProductModel;
