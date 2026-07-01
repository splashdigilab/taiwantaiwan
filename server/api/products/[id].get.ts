export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id') as string
  const product = getProduct(id)
  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }
  return product
})
