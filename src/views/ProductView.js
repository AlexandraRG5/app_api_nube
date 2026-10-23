/** "Vista" de la API: mismo formato JSON que usa el modelo Product de la app Flutter. */
class ProductView {
  static render(p) {
    return {
      id: p.id,
      title: p.title,
      price: Number(p.price),
      description: p.description,
      category: p.category,
      image: p.image,
      rating: { rate: Number(p.rating), count: Number(p.rating_count) },
    };
  }

  static renderList(products) {
    return products.map(ProductView.render);
  }
}

module.exports = ProductView;
