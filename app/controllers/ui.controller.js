import { i18n } from '../../server.js'
const baseUrl = 'https://www.tradingradar.net'
const supportedLangs = ['en', 'it']
const fallback = 'en'

const getViewParams = function(id, lang, path) {
  const canonicalUrl = `${baseUrl}${path}`
  const hreflangs = supportedLangs.map(code => ({
    lang: code,
    url: `${baseUrl}${path.replace(lang, code)}`
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
    res.render('home', getViewParams('hp', lang, req.path))
  }
}


// Exchange
export async function exchangeView(req, res) {
  const lang = req.params.lang
  const exchange = req.params.exchange
  if (!supportedLangs.includes(lang)) {
    res.redirect((req.url).replace(lang, fallback))
  } else {
    i18n.setLocale(req, lang)
    let params = getViewParams('exchange', lang, req.path)
    const breadcrumbs = [
      {
        name: exchange
      }
    ]
    params = { ...params, breadcrumbs, exchange }
    res.render('exchange', params)
  }
}


// Stock
export async function stockView(req, res) {
  const lang = req.params.lang
  const stockUrl = req.params.stockUrl
  if (!supportedLangs.includes(lang)) {
    res.redirect((req.url).replace(lang, fallback))
  } else {
    i18n.setLocale(req, lang)
    let params = getViewParams('stock', lang, req.path)
    const breadcrumbs = [
      {
        name: stockUrl
      }
    ]
    params = { ...params, breadcrumbs, stockUrl }
    res.render('stock', params)
  }
}


// Privacy
export async function privacyView(req, res) {
  const lang = req.params.lang
  if (!supportedLangs.includes(lang)) {
    res.redirect((req.url).replace(lang, fallback))
  } else {
    i18n.setLocale(req, lang)
    let params = getViewParams('privacy', lang, req.path)
    const breadcrumbs = [
      {
        name: 'privacy'
      }
    ]
    params = { ...params, breadcrumbs }
    res.render('privacy', params)
  }
}


// Contacts
export async function contactsView(req, res) {
  const lang = req.params.lang
  if (!supportedLangs.includes(lang)) {
    res.redirect((req.url).replace(lang, fallback))
  } else {
    i18n.setLocale(req, lang)
    let params = getViewParams('contacts', lang, req.path)
    const breadcrumbs = [
      {
        name: 'contacts'
      }
    ]
    params = { ...params, breadcrumbs }
    res.render('contacts', params)
  }
}


// About
export async function aboutView(req, res) {
  const lang = req.params.lang
  if (!supportedLangs.includes(lang)) {
    res.redirect((req.url).replace(lang, fallback))
  } else {
    i18n.setLocale(req, lang)
    let params = getViewParams('about', lang, req.path)
    const breadcrumbs = [
      {
        name: 'about'
      }
    ]
    params = { ...params, breadcrumbs }
    res.render('about', params)
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
