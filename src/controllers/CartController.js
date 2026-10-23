const CartModel = require('../models/CartModel');
const ProductModel = require('../models/ProductModel');
const CartView = require('../views/CartView');
const HttpError = require('../utils/HttpError');

const MAX = CartModel.MAX_QUANTITY;

function parsePositiveInt(raw, label) {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) throw new HttpError(400, `${label} inválido.`);
  return n;
}

/** Devuelve el carrito del usuario o responde 404 (sin revelar carritos ajenos). */
async function ownedCart(cartId, userId) {
  const cart = await CartModel.findCart(cartId);
  if (!cart || cart.user_id !== userId) throw new HttpError(404, 'Carrito no encontrado.');
  return cart;
}

async function renderCart(cartId) {
  const cart = await CartModel.findCart(cartId);
  return CartView.render(cart, await CartModel.getItems(cartId));
}

class CartController {
  /** GET /api/carts/me -> carrito del usuario (lo crea vacío si no existe) */
  static async me(req, res) {
    const cartId = await CartModel.getOrCreateCartId(req.user.id);
    res.json(await renderCart(cartId));
  }

  /** POST /api/carts { productId, quantity } -> agrega o suma cantidad (US09) */
  static async store(req, res) {
    const productId = parsePositiveInt(req.body && req.body.productId, 'productId');
    const quantity = Number(req.body && req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX) {
      throw new HttpError(400, `La cantidad debe ser un entero entre 1 y ${MAX}.`);
    }

    if (!(await ProductModel.findById(productId))) throw new HttpError(404, 'Producto no disponible.');

    const cartId = await CartModel.getOrCreateCartId(req.user.id);
    await CartModel.addItem(cartId, productId, quantity);
    res.status(201).json(await renderCart(cartId));
  }

  /** PUT /api/carts/:id { productId, quantity } -> cambia la cantidad; 0 elimina el artículo (US10) */
  static async update(req, res) {
    const cartId = parsePositiveInt(req.params.id, 'ID de carrito');
    await ownedCart(cartId, req.user.id);

    const productId = parsePositiveInt(req.body && req.body.productId, 'productId');
    const quantity = Number(req.body && req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 0 || quantity > MAX) {
      throw new HttpError(400, `La cantidad debe ser un entero entre 0 y ${MAX}.`);
    }

    const ok =
      quantity === 0
        ? await CartModel.removeItem(cartId, productId)
        : await CartModel.setQuantity(cartId, productId, quantity);
    if (!ok) throw new HttpError(404, 'El artículo no está en el carrito.');

    res.json(await renderCart(cartId));
  }

  /** DELETE /api/carts/:id/items/:productId -> quita un artículo del carrito (US10) */
  static async removeItem(req, res) {
    const cartId = parsePositiveInt(req.params.id, 'ID de carrito');
    const productId = parsePositiveInt(req.params.productId, 'productId');
    await ownedCart(cartId, req.user.id);

    if (!(await CartModel.removeItem(cartId, productId))) {
      throw new HttpError(404, 'El artículo no está en el carrito.');
    }
    res.json(await renderCart(cartId));
  }

  /** DELETE /api/carts/:id -> vacía todo el carrito */
  static async clear(req, res) {
    const cartId = parsePositiveInt(req.params.id, 'ID de carrito');
    await ownedCart(cartId, req.user.id);
    await CartModel.clear(cartId);
    res.json(await renderCart(cartId));
  }
}

module.exports = CartController;
