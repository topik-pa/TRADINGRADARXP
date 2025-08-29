/* eslint-disable no-console */
async function getStocks() {
  const url = '/api/stocks/accents'
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(error.message)
  }
}

function createComponent(tag, attrs = {}, children = []) {
  const el = document.createElement(tag)
  // Imposta attributi
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value)
  }
  // Aggiunge i figli (contenuto, slot, ecc.)
  for (const child of children) {
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(child))
    } else {
      el.appendChild(child)
    }
  }
  return el
}

export default  {
  init: async() => {
    const cssModule = await import('./home.css', {
      with: { type: 'css' }
    })
    try {
      document.adoptedStyleSheets = [cssModule.default]
    // eslint-disable-next-line no-unused-vars, no-empty
    } catch (err) {}

    const main = document.querySelector('main')
    let stocks = await getStocks()
    if (stocks.length === 0) return

    stocks = stocks.filter((s) => {
      if(s.volume !== null && s.price !== null) {
        return s.volume * s.price >= 10_000
      }
    })

    stocks.forEach(stock => {
      const direction = stock.relVariation > 0 ? 'positive' : 'negative'
      const id = stock.relVariation > 0 ? 'bests' : 'worsts'
      const bullet = createComponent('cmp-bullet', { direction: direction }, [
        createComponent('span', { slot: 'title' }, ['In evidenza']),
        createComponent('span', { slot: 'name' }, [stock.name]),
        createComponent('span', { slot: 'value' }, [stock.relVariation])
      ])
      document.getElementById(id).appendChild(bullet)
    })

    //const { worsts, bests } = getHighlights(stocks)
  }
}
