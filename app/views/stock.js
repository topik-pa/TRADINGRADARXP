import {
  updateStatus
} from '../scripts/globals.js'
import '../scripts/vendor/Chart.js'

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


    const ctx = document.getElementById('myChart')
    const prices = JSON.parse(ctx.dataset.prices)
    const volumes = JSON.parse(ctx.dataset.volumes)
    const labels = []
    for (let i = 0; i < prices.length; i++) {
      if (i===0) {
        labels.unshift('Today')
      } else {
        labels.unshift(-i)
      }
    }
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
        labels: labels
      },
      options: {
        responsive: true
      }
    })

    updateStatus([$main], 'success')
  }
}
