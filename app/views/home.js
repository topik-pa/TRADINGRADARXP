async function getAllStocks() {
  // encodeURI('A.B.P. NOCIVELLI'.toLowerCase().replaceAll(/\s/g, '').replaceAll('.', '-'))
  const lang = document.documentElement.lang
  const url = '/api/stocks'
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const json = await response.json()
    // console.log(json)
    const ul = document.getElementById('stock-list')
    ul.innerHTML = json.map(stock => `<li><a href="/${lang}/${stock.urlName}">${stock.name}</a></li>`).join('')
  } catch (error) {
    console.error(error.message)
  }
}

export default  {
  init: async() => {
    const cssModule = await import('../views/home.css', {
      with: { type: 'css' }
    })
    try {
      document.adoptedStyleSheets = [cssModule.default]
    // eslint-disable-next-line no-unused-vars, no-empty
    } catch (err) {}

    getAllStocks()
  }
}
