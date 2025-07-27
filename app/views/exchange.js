/* eslint-disable no-console */
async function getStocks() {
  const exchange = document.body.dataset.exchange
  const url = '/api/stocks/' + exchange
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

function getHighlights(stocks) {
  let worst = stocks[0]
  let best = stocks[0]
  stocks.forEach(stock => {
    if (+stock.relVariation.replace('%','') > +best.relVariation.replace('%','')) {
      best = stock
    }
    if (+stock.relVariation.replace('%','') < +worst.relVariation.replace('%','')) {
      worst = stock
    }
  })
  return { worst, best }
}

function createComponent(tag, attrs = {}, children = []) {
  const el = document.createElement(tag)
  // Imposta attributi
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value)
  }
  // Aggiunge i figli (contenuto, slot, ecc.)
  for (const child of children) {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child))
    } else {
      el.appendChild(child)
    }
  }
  return el
}


export default  {
  init: async() => {
    const cssModule = await import('../views/exchange.css', {
      with: { type: 'css' }
    })
    try {
      document.adoptedStyleSheets = [cssModule.default]
    // eslint-disable-next-line no-empty
    } catch (err) {}

    const main = document.querySelector('main')
    const stocks = await getStocks()
    const { worst, best } = getHighlights(stocks)

    const worstBullet = createComponent('cmp-bullet', { direction: 'negative' }, [
      createComponent('span', { slot: 'title' }, ['In evidenza']),
      createComponent('span', { slot: 'name' }, [worst.name]),
      createComponent('span', { slot: 'value' }, [worst.relVariation])
    ])
    document.getElementById('stock-list').appendChild(worstBullet)

    const bestBullet = createComponent('cmp-bullet', { direction: 'positive' }, [
      createComponent('span', { slot: 'title' }, ['In evidenza']),
      createComponent('span', { slot: 'name' }, [best.name]),
      createComponent('span', { slot: 'value' }, [best.relVariation])
    ])
    document.getElementById('stock-list').appendChild(bestBullet)
  }
}
