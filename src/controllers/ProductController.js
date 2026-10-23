const ProductModel = require('../models/ProductModel');
const ProductView = require('../views/ProductView');
const HttpError = require('../utils/HttpError');

function parseId(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) throw new HttpError(400, 'ID inválido.');
  return id;
}

function isHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

/** Validación de servidor (la app ya valida, pero el backend no se fía de nadie). */
function validateProductBody(body) {
  const { title, price, description, image, category } = body || {};
  const text = (v) => typeof v === 'string' && v.trim().length > 0;

  if (!text(title)) throw new HttpError(400, 'El título es obligatorio.');
  if (!text(description)) throw new HttpError(400, 'La descripción es obligatoria.');
  if (!text(category)) throw new HttpError(400, 'La categoría es obligatoria.');
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
    throw new HttpError(400, 'El precio debe ser un número mayor a cero.');
  }
  if (!text(image) || !isHttpUrl(image.trim())) {
    throw new HttpError(400, 'La imagen debe ser una URL http/https válida.');
  }

  return {
    title: title.trim(),
    price: Math.round(price * 100) / 100,
    description: description.trim(),
    image: image.trim(),
    category: category.trim(),
  };
}

class ProductController {
  /** GET /api/products */
  static async index(req, res) {
    res.json(ProductView.renderList(await ProductModel.findAll()));
  }

  /** GET /api/products/categories -> ["electrónica", ...] */
  static async categories(req, res) {
    res.json(await ProductModel.listCategories());
  }

  /** GET /api/products/category/:category */
  static async byCategory(req, res) {
    res.json(ProductView.renderList(await ProductModel.findByCategory(req.params.category)));
  }

  /** GET /api/products/:id */
  static async show(req, res) {
    const product = await ProductModel.findById(parseId(req.params.id));
    if (!product) throw new HttpError(404, 'Producto no disponible.');
    res.json(ProductView.render(product));
  }

  /** POST /api/products (solo administrador) */
  static async store(req, res) {
    const created = await ProductModel.create(validateProductBody(req.body));
    res.status(201).json(ProductView.render(created));
  }

  /** PUT /api/products/:id (solo administrador) */
  static async update(req, res) {
    const id = parseId(req.params.id);
    const updated = await ProductModel.update(id, validateProductBody(req.body));
    if (!updated) throw new HttpError(404, 'Producto no disponible.');
    res.json(ProductView.render(updated));
  }

  /** DELETE /api/products/:id (solo administrador) */
  static async destroy(req, res) {
    const removed = await ProductModel.remove(parseId(req.params.id));
    if (!removed) throw new HttpError(404, 'Producto no disponible.');
    res.json({ message: 'Producto eliminado.' });
  }
}

module.exports = ProductController;
