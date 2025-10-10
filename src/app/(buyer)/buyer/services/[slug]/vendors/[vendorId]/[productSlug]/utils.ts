import { server } from '@/libs/axios/server'

export async function fetchProductBySlug(slug: string) {
  try {
    const res = await server({
      method: 'get',
      url: `/v1/products/slug/${slug}`,
    })
    if (res.data.code === 0) {
      return res.data.data
    }
    return null
  } catch (e) {
    console.log(e)
    return null
  }
}
