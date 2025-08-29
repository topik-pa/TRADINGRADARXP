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

async function getAccents() {
  const exchange = document.body.dataset.exchange
  const url = '/api/stocks/accents/' + exchange
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

async function getPerformance1M(trend) {
  const exchange = document.body.dataset.exchange
  const url = '/api/stocks/performance/' + exchange + '/' + trend
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
    if (stock.relVariation > best.relVariation) {
      best = stock
    }
    if (stock.relVariation < worst.relVariation) {
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
    if (!child) continue
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
    const cssModule = await import('./exchange.css', {
      with: { type: 'css' }
    })
    try {
      document.adoptedStyleSheets = [cssModule.default]
    // eslint-disable-next-line no-empty
    } catch (err) {}

    const main = document.querySelector('main')
    const stocks = await getStocks()
    if (stocks.length === 0) return
    const { worst, best } = getHighlights(stocks)

    const worstBullet = createComponent('cmp-bullet', { direction: 'negative' }, [
      createComponent('span', { slot: 'title' }, ['In evidenza']),
      createComponent('span', { slot: 'name' }, [worst.name]),
      createComponent('span', { slot: 'value' }, [worst.relVariation])
    ])
    document.getElementById('highlights').appendChild(worstBullet)

    const bestBullet = createComponent('cmp-bullet', { direction: 'positive' }, [
      createComponent('span', { slot: 'title' }, ['In evidenza']),
      createComponent('span', { slot: 'name' }, [best.name]),
      createComponent('span', { slot: 'value' }, [best.relVariation])
    ])
    document.getElementById('highlights').appendChild(bestBullet)


    let accents = await getAccents()

    accents = accents.filter((s) => {
      if(s.volume !== null && s.price !== null) {
        return s.volume * s.price >= 10_000
      }
    })
    accents.forEach(stock => {
      const direction = stock.relVariation > 0 ? 'positive' : 'negative'
      const id = stock.relVariation > 0 ? 'bests' : 'worsts'
      const bullet = createComponent('cmp-bullet', { direction: direction }, [
        createComponent('span', { slot: 'title' }, ['In evidenza']),
        createComponent('span', { slot: 'name' }, [stock.name]),
        createComponent('span', { slot: 'value' }, [stock.relVariation])
      ])
      document.getElementById(id).appendChild(bullet)
    })


    const bestPerformance = await getPerformance1M('up')
    bestPerformance.forEach(stock => {
      const direction = stock.relVariation > 0 ? 'positive' : 'negative'
      const bullet = createComponent('cmp-bullet', { direction: direction }, [
        createComponent('span', { slot: 'title' }, ['In evidenza']),
        createComponent('span', { slot: 'name' }, [stock.name]),
        createComponent('span', { slot: 'value' }, [stock.relVariation])
      ])
      document.getElementById('performance-up').appendChild(bullet)
    })

    const wostPerformance = await getPerformance1M('down')
    wostPerformance.forEach(stock => {
      const direction = stock.relVariation > 0 ? 'positive' : 'negative'
      const bullet = createComponent('cmp-bullet', { direction: direction }, [
        createComponent('span', { slot: 'title' }, ['In evidenza']),
        createComponent('span', { slot: 'name' }, [stock.name]),
        createComponent('span', { slot: 'value' }, [stock.relVariation])
      ])
      document.getElementById('performance-down').appendChild(bullet)
    })
  }
}
