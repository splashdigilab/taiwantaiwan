// =============================================================
//  Data-access layer.
//  Today it reads bundled JSON files. To move to a real backend
//  later, replace the bodies of these functions with DB / HTTP
//  calls — the API route handlers and the frontend stay untouched.
// =============================================================
import products from '../data/products.json'
import home from '../data/home.json'
import about from '../data/about.json'
import retailers from '../data/retailers.json'

export type Localized = { zh: string; en: string; jp: string }

export const getProducts = () => products
export const getProduct = (id: string) => products.find((p) => p.id === id)
export const getHome = () => home
export const getAbout = () => about
export const getRetailers = () => retailers
