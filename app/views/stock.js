/* eslint-disable no-console */
import '../scripts/vendor/Chart.js'

async function getStock() {
  const stockUrl = document.body.dataset.stock
  const url = '/api/stocks/' + stockUrl
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
    const cssModule = await import('./stock.css', {
      with: { type: 'css' }
    })
    try {
      document.adoptedStyleSheets = [cssModule.default]
    // eslint-disable-next-line no-empty
    } catch (err) {}



    // const main = document.querySelector('main')
    const stock = await getStock()

    const variazioni = stock.history.price
    const volumi = stock.history.volume

    const ctx = document.getElementById('myChart')
    new window.Chart(ctx, {
      data: {
        datasets: [
          {
            type: 'line',
            label: 'Variazione prezzo',
            data: variazioni,
            yAxisID: 'yPrice'
          },
          {
            type: 'bar',
            label: 'Variazione Volumi',
            data: volumi,
            yAxisID: 'yVolume'
          }],
        labels: ['-4', '-3', '-2', '-1', 'Today']
      },
      options: {
        responsive: true
      }
    })

    document.getElementById('stock-name').innerHTML = stock.name

    const lastPriceBullet = createComponent('cmp-bullet', { direction: 'negative' }, [
      createComponent('span', { slot: 'title' }, ['Ultimo prezzo']),
      createComponent('span', { slot: 'name' }, [stock.name]),
      createComponent('span', { slot: 'value' }, [stock.price])
    ])
    document.getElementById('stock-details').appendChild(lastPriceBullet)

    const relVariationBullet = createComponent('cmp-bullet', { direction: 'negative' }, [
      createComponent('span', { slot: 'title' }, ['Variazione %']),
      createComponent('span', { slot: 'name' }, [stock.name]),
      createComponent('span', { slot: 'value' }, [stock.relVariation])
    ])
    document.getElementById('stock-details').appendChild(relVariationBullet)

    const volumeBullet = createComponent('cmp-bullet', { direction: 'negative' }, [
      createComponent('span', { slot: 'title' }, ['Volume']),
      createComponent('span', { slot: 'name' }, [stock.name]),
      createComponent('span', { slot: 'value' }, [stock.volume])
    ])
    document.getElementById('stock-details').appendChild(volumeBullet)

    const performance1M = createComponent('cmp-bullet', { direction: 'negative' }, [
      createComponent('span', { slot: 'title' }, ['Performance mensile']),
      createComponent('span', { slot: 'name' }, [stock.name]),
      createComponent('span', { slot: 'value' }, [stock.perf1M])
    ])
    document.getElementById('stock-performance').appendChild(performance1M)

    const performance1A = createComponent('cmp-bullet', { direction: 'negative' }, [
      createComponent('span', { slot: 'title' }, ['Performance annuale']),
      createComponent('span', { slot: 'name' }, [stock.name]),
      createComponent('span', { slot: 'value' }, [stock.perf52W])
    ])
    document.getElementById('stock-performance').appendChild(performance1A)

  }
}
