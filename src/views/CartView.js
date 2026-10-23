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

module.exports = CartView;
