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

    const euronext = document.getElementById('euronext')
    const isin = euronext.dataset.isin
    const urlfrag2 = euronext.dataset.url.substring(euronext.dataset.url.indexOf(isin))
    const urlfrag1 = document.documentElement.lang
    euronext.href = `https://live.euronext.com/${urlfrag1}/product/equities/${urlfrag2}`

    const ctx = document.getElementById('myChart')
    if(ctx.dataset.prices && ctx.dataset.volumes) {
      const prices = JSON.parse(ctx.dataset.prices)
      const volumes = JSON.parse(ctx.dataset.volumes)
      const labels = []
      for (let i = 0; i < prices.length; i++) {
        if (i===0) {
          labels.unshift('Last')
        } else {
          labels.unshift(-i)
        }
      }
      new window.Chart(ctx, {
        data: {
          datasets: [
            {
              type: 'line',
              label: 'Prezzo',
              data: prices,
              borderColor: '#3F6580',
              backgroundColor: '#84bde2',
              yAxisID: 'yPrice'
            },
            {
              type: 'bar',
              label: 'Volumi',
              data: volumes,
              backgroundColor: '#a9ddff',
              yAxisID: 'yVolume'
            }],
          labels: labels
        },
        options: {
          responsive: true
        }
      })
    }
    updateStatus([$main], 'success')
  }
}
