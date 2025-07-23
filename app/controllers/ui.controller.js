import { i18n } from '../../index.js'
const baseUrl = 'https://www.tradingradar.net'
const supportedLangs = ['en', 'it']
const fallback = 'en'

const getViewParams = function(id, lang) {
  const canonicalUrl = `${baseUrl}/${lang}`
  const hreflangs = supportedLangs.map(code => ({
    lang: code,
    url: `${baseUrl}/${code}`
  }))
  return {
    id,
    className: id,
    canonicalUrl,
    hreflangs
  }
}



// HP
export async function hpView(req, res) {
  const lang = req.params.lang
  if (!supportedLangs.includes(lang)) {
    res.redirect((req.url).replace(lang, fallback))
  } else {
    i18n.setLocale(req, lang)
    res.render('home', getViewParams('hp', lang))
  }
}


// Stock
export async function stockView(req, res) {
  const lang = req.params.lang
  if (!supportedLangs.includes(lang)) {
    res.redirect((req.url).replace(lang, fallback))
  } else {
    i18n.setLocale(req, lang)
    res.render('stock', getViewParams('stock', lang))
  }
}


// Stock target price
export async function stockViewTP(req, res) {
  const lang = req.params.lang
  if (!supportedLangs.includes(lang)) {
    res.redirect((req.url).replace(lang, fallback))
  } else {
    i18n.setLocale(req, lang)
    res.render('stock-tp', getViewParams('stock-tp', lang))
  }
}


// Stock news
export async function stockViewN(req, res) {
  const lang = req.params.lang
  if (!supportedLangs.includes(lang)) {
    res.redirect((req.url).replace(lang, fallback))
  } else {
    i18n.setLocale(req, lang)
    res.render('stock-d', getViewParams('stock-d', lang))
  }
}


// Stock news
export async function stockViewDividend(req, res) {
  const lang = req.params.lang
  if (!supportedLangs.includes(lang)) {
    res.redirect((req.url).replace(lang, fallback))
  } else {
    i18n.setLocale(req, lang)
    res.render('stock-d', getViewParams('stock-d', lang))
  }
}



// Stocks index
// export async function stocksIndex(req, res) {
//   const lang = req.params.lang
//   if (!supportedLangs.includes(lang)) {
//     res.redirect((req.url).replace(lang, fallback))
//   } else {
//     i18n.setLocale(req, lang)
//     res.render('index', getViewParams('index', lang))
//   }
// }
