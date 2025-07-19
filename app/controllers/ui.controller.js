import { i18n } from '../../index.js'

// HP
export async function hpView(req, res) {
  // res.json({ message: 'Welcome to the tradingradar XP project...' })
  const lang = req.params.lang
  const baseUrl = 'https://www.tradingradar.net'
  const canonicalUrl = `${baseUrl}/${lang}`
  const hreflangs = ['en', 'it'].map(code => ({
    lang: code,
    url: `${baseUrl}/${code}`
  }))

  if (!['en', 'it'].includes(lang)) {
    return res.redirect('/en/') // fallback
  }
  i18n.setLocale(req, lang)
  res.render('home', {
    id: 'hp',
    className: 'home',
    canonicalUrl,
    hreflangs
  })
}
