import { i18n } from '../../index.js'
const baseUrl = 'https://www.tradingradar.net'
const supportedLangs = ['en', 'it']
const fallback = '/en/'
const hreflangs = supportedLangs.map(code => ({
  lang: code,
  url: `${baseUrl}/${code}`
}))

// HP
export async function hpView(req, res) {
  const lang = req.params.lang
  const canonicalUrl = `${baseUrl}/${lang}`
  if (!supportedLangs.includes(lang)) return res.redirect(fallback) // fallback
  i18n.setLocale(req, lang)

  res.render('home', {
    id: 'hp',
    className: 'home',
    canonicalUrl,
    hreflangs
  })
}


// Stock
export async function hpStock(req, res) {
  const lang = req.params.lang
  const canonicalUrl = `${baseUrl}/${lang}`
  if (!supportedLangs.includes(lang)) return res.redirect(fallback) // fallback
  i18n.setLocale(req, lang)

  res.render('stock', {
    id: 'stock',
    className: 'stock',
    canonicalUrl,
    hreflangs,
    isin: req.params.isin
  })
}
