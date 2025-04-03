export const convertToCartData = carts => {
  return carts.map(c => {
    return {
      product: c.product.product_id,
      name: c.product.name,
      imageUrl: c.product.product_image_url,
      price: c.product.price,
      countInStock: c.product.stock,
      qty: c.quantity,
      _id: c.product.product_id,
    }
  })
}
