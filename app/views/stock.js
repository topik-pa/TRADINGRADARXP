import {
  updateStatus,
  printJSONLD
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

    const lang = document.documentElement.lang
    const euronext = document.getElementById('euronext')
    const isin = euronext.dataset.isin
    const name = euronext.dataset.name.toLocaleLowerCase()
    const urlfrag2 = euronext.dataset.url.substring(euronext.dataset.url.indexOf(isin))
    const urlfrag1 = document.documentElement.lang
    euronext.href = `https://live.euronext.com/${urlfrag1}/product/equities/${urlfrag2}`

    const rallyIndexElem = document.getElementById('rallyindex')
    const rallyIndexValue = document.getElementsByClassName('rallyindex')[0]
    const variation = Math.abs(rallyIndexElem.dataset.variation)
    const cap = rallyIndexElem.dataset.cap
    const capPriceRatio = +(100 / (rallyIndexElem.dataset.cap / (rallyIndexElem.dataset.volume * rallyIndexElem.dataset.price))).toFixed(3)
    let rallyIndex = 50

    if (variation >= 21) {
      rallyIndex += 34
    } else if (variation >= 13) {
      rallyIndex += 21
    } else if (variation >= 8) {
      rallyIndex += 13
    } else if (variation >= 5) {
      rallyIndex += 8
    }

    if (capPriceRatio >= 2.1) {
      rallyIndex += 34
    } else if (capPriceRatio >= 1.3) {
      rallyIndex += 21
    } else if (capPriceRatio >= 0.8) {
      rallyIndex += 13
    } else if (capPriceRatio >= 0.1) {
      rallyIndex += 8
    }

    if (cap > 5 * 10**6) {
      rallyIndex += 5  //5
    }
    if (cap > 8 * 10**6) {
      rallyIndex += 3  //8
    }
    if (cap > 13 * 10**6) {
      rallyIndex += 5  //13
    }
    if (cap > 21 * 10**6) {
      rallyIndex += 8  //21
    }


    let rIndex
    if (rallyIndex > 100) {
      rIndex = 'A+'
    } else if (rallyIndex > 95 && rallyIndex <= 100) {
      rIndex = 'A'
    } else if (rallyIndex > 90 && rallyIndex <= 95) {
      rIndex = 'B+'
    } else if (rallyIndex > 85 && rallyIndex <= 90) {
      rIndex = 'B'
    } else if (rallyIndex > 80 && rallyIndex <= 85) {
      rIndex = 'C+'
    } else if (rallyIndex > 75 && rallyIndex <= 80) {
      rIndex = 'C'
    } else if (rallyIndex > 70 && rallyIndex <= 75) {
      rIndex = 'D'
    } else {
      rIndex = 'E'
    }


    rallyIndexValue.innerHTML = `<span>${rIndex}</span>`
    if(rallyIndexElem.dataset.variation > 0) {
      rallyIndexValue.classList.add('green')
    } else {
      rallyIndexValue.classList.add('red')
    }


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
              label: 'Price',
              data: prices,
              borderColor: '#3F6580',
              backgroundColor: '#84bde2',
              yAxisID: 'yPrice'
            },
            {
              type: 'bar',
              label: 'Volume',
              data: volumes,
              backgroundColor: '#a9ddff',
              yAxisID: 'yVolume'
            }],
          labels: labels
        },
        options: {
          responsive: true,
          scales: {
            yPrice: {
              display: false
            },
            yVolume: {
              display: false
            }
          }
        }
      })
    }
    updateStatus([$main], 'success')

    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `https://rallyingstocks.com/${lang}/${name}/#webpage`,
      'name': document.querySelector('title')?.innerText || '',
      'url': `https://rallyingstocks.com/${lang}/${name}`,
      'description': document.querySelector('meta[name="description"]')?.content || '',
      'publisher': {
        '@id': 'https://rallyingstocks.com/#organization'
      },
      'inLanguage': lang,
      'isPartOf': {
        '@id': 'https://rallyingstocks.com/#website'
      }
    }
    printJSONLD(ld)

  }
}
