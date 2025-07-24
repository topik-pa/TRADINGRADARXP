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
    let params = getViewParams('stock', lang)
    const breadcrumbs = [
      {
        name: req.params.stockUrl
      }
    ]
    params = { ...params, breadcrumbs }

    res.render('stock', params)
  }
}


// Stock target price
export async function stockViewTP(req, res) {
  const lang = req.params.lang
  if (!supportedLangs.includes(lang)) {
    res.redirect((req.url).replace(lang, fallback))
  } else {
    i18n.setLocale(req, lang)
    let params = getViewParams('stock', lang)
    const breadcrumbs = [
      {
        name: req.params.stockUrl,
        url: '/' + lang + '/' + req.params.stockUrl
      },
      {
        name: 'target-price'
      }
    ]
    params = { ...params, breadcrumbs }

    res.render('stock-tp', params)
  }
}


// Stock news
export async function stockViewN(req, res) {
  const lang = req.params.lang
  if (!supportedLangs.includes(lang)) {
    res.redirect((req.url).replace(lang, fallback))
  } else {
    i18n.setLocale(req, lang)
    let params = getViewParams('stock', lang)
    const breadcrumbs = [
      {
        name: req.params.stockUrl,
        url: '/' + lang + '/' + req.params.stockUrl
      },
      {
        name: 'news'
      }
    ]
    params = { ...params, breadcrumbs }

    res.render('stock-n', params)
  }
}


// Stock dividend
export async function stockViewDividend(req, res) {
  const lang = req.params.lang
  if (!supportedLangs.includes(lang)) {
    res.redirect((req.url).replace(lang, fallback))
  } else {
    i18n.setLocale(req, lang)
    let params = getViewParams('stock', lang)
    const breadcrumbs = [
      {
        name: req.params.stockUrl,
        url: '/' + lang + '/' + req.params.stockUrl
      },
      {
        name: 'dividend'
      }
    ]
    params = { ...params, breadcrumbs }

    res.render('stock-d', params)
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
