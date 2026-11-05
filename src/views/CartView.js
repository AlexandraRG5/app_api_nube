/** "Vista" de la API: forma del JSON del carrito (parecida al /carts de Fake Store API). */
class CartView {
  static render(cart, items) {
    return {
      id: cart.id,
      userId: cart.user_id,
      date: new Date(cart.updated_at).toISOString(),
      products: items.map((i) => ({
        productId: i.product_id,
        quantity: Number(i.quantity),
        title: i.title,
        price: Number(i.price),
        image: i.image,
      })),
    };
  }
}

/**
 * Forma de un carrito en el historial global (US12): solo ids y cantidades,
 * igual que el /carts de Fake Store API. El título del producto lo obtiene la
 * app cruzando productId con el catálogo (GET /products).
 */
CartView.renderGlobal = (cart) => ({
  id: cart.id,
  userId: cart.user_id,
  username: cart.username,
  date: new Date(cart.created_at).toISOString(),
  products: cart.items.map((i) => ({ productId: i.product_id, quantity: Number(i.quantity) })),
});

module.exports = CartView;
