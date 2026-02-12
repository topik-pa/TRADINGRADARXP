import {
  updateStatus,
  getData,
  createComponent
} from '../scripts/globals.js'

export default  {
  init: async() => {
    const cssModule = await import('./stocks.css', {
      with: { type: 'css' }
    })
    try {
      document.adoptedStyleSheets = [cssModule.default]
    // eslint-disable-next-line no-empty
    } catch (err) {}

    const $results = document.getElementById('stocks_list')

    updateStatus([$results], 'loading')

    const lang = document.documentElement.lang
    const letter = $results.dataset.letter || 'A'
    if(letter) {
      const stocks = await getData('/api/stocks/' + letter.toLowerCase())
      if (stocks.length !== 0) {
        stocks.forEach(stock => {
          const isBigCap = stock.cap > 3000
          const direction = stock.relVariation > 0 ? 'positive' : 'negative'
          const bullet = createComponent('cmp-bullet', {
            direction,
            url: '/'+lang+'/'+stock.slug,
            status: 'Status: '+(stock.status || 'N/A'),
            isBigCap: isBigCap ? 'Big capitalization' : 'nope'
          }, [
            createComponent('span', { slot: 'market' }, [stock.market]),
            createComponent('span', { slot: 'name' }, [stock.name]),
            createComponent('span', { slot: 'value' }, [stock.relVariation]),
            createComponent('span', { slot: 'lastmod' }, [stock.lastTrade]),
            createComponent('span', { slot: 'footer' }, [stock.name])
          ])
          $results.appendChild(bullet)
        })
      }
    }
    updateStatus([$results], 'success')

  }
}
