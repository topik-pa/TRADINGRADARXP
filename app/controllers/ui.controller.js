import { i18n } from '../../index.js'
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


// Stock
export async function exchangeView(req, res) {
  const lang = req.params.lang
  if (!supportedLangs.includes(lang)) {
    res.redirect((req.url).replace(lang, fallback))
  } else {
    i18n.setLocale(req, lang)
    let params = getViewParams('exchange', lang, req.path)
    const breadcrumbs = [
      {
        name: req.params.exchange
      }
    ]
    params = { ...params, breadcrumbs }

    res.render('exchange', params)
  }
}


// Stock
export async function stockView(req, res) {
  const lang = req.params.lang
  if (!supportedLangs.includes(lang)) {
    res.redirect((req.url).replace(lang, fallback))
  } else {
    i18n.setLocale(req, lang)
    let params = getViewParams('stock', lang, req.path)
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
    let params = getViewParams('stock', lang, req.path)
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
    let params = getViewParams('stock', lang, req.path)
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
    let params = getViewParams('stock', lang, req.path)
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
export async function ContactsView(req, res) {
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
