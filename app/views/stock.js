import {
  createComponent,
  updateStatus
} from '../scripts/globals.js'
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


export default  {
  init: async() => {
    const cssModule = await import('./stock.css', {
      with: { type: 'css' }
    })
    try {
      document.adoptedStyleSheets = [cssModule.default]
    // eslint-disable-next-line no-empty
    } catch (err) {}

    const $main = document.querySelector('main')
    updateStatus([$main], 'loading')
    const stock = await getStock()

    document.getElementById('stock-name').innerHTML = stock.name

    const prices = stock.history.price
    const volumes = stock.history.volume
    const ctx = document.getElementById('myChart')
    new window.Chart(ctx, {
      data: {
        datasets: [
          {
            type: 'line',
            label: 'Variazione prezzo',
            data: prices,
            yAxisID: 'yPrice'
          },
          {
            type: 'bar',
            label: 'Variazione Volumi',
            data: volumes,
            yAxisID: 'yVolume'
          }],
        labels: ['-4', '-3', '-2', '-1', 'Today']
      },
      options: {
        responsive: true
      }
    })

    const lastPriceBullet = createComponent('cmp-bullet', { direction: null }, [
      createComponent('span', { slot: 'head' }, [stock.name]),
      createComponent('span', { slot: 'name' }, ['Ultimo prezzo']),
      createComponent('span', { slot: 'value' }, [stock.price])
    ])
    document.getElementById('stock-details').appendChild(lastPriceBullet)

    const direction = stock.relVariation > 0 ? 'positive' : 'negative'
    const relVariationBullet = createComponent('cmp-bullet', { direction }, [
      createComponent('span', { slot: 'head' }, [stock.name]),
      createComponent('span', { slot: 'name' }, ['Variazione']),
      createComponent('span', { slot: 'value' }, [stock.relVariation])
    ])
    document.getElementById('stock-details').appendChild(relVariationBullet)

    const volumeBullet = createComponent('cmp-bullet', { direction: null }, [
      createComponent('span', { slot: 'head' }, [stock.name]),
      createComponent('span', { slot: 'name' }, ['Volume']),
      createComponent('span', { slot: 'value' }, [stock.volume])
    ])
    document.getElementById('stock-details').appendChild(volumeBullet)


    const performance1M = createComponent('cmp-bullet', { direction: stock.perf1M > 0 ? 'positive' : 'negative' }, [
      createComponent('span', { slot: 'head' }, [stock.name]),
      createComponent('span', { slot: 'name' }, ['Performance mensile']),
      createComponent('span', { slot: 'value' }, [stock.perf1M])
    ])
    document.getElementById('stock-performance').appendChild(performance1M)

    const performance1A = createComponent('cmp-bullet', { direction: stock.perf52W > 0 ? 'positive' : 'negative' }, [
      createComponent('span', { slot: 'head' }, [stock.name]),
      createComponent('span', { slot: 'name' }, ['Performance annuale']),
      createComponent('span', { slot: 'value' }, [stock.perf52W])
    ])
    document.getElementById('stock-performance').appendChild(performance1A)

    updateStatus([$main], 'success')
  }
}
