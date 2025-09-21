import {
  createComponent,
  getData,
  removeSmallCaps,
  updateStatus,
  printStockList
} from '../scripts/globals.js'

export default  {
  init: async() => {
    const cssModule = await import('./home.css', {
      with: { type: 'css' }
    })
    try {
      document.adoptedStyleSheets = [cssModule.default]
    // eslint-disable-next-line no-unused-vars, no-empty
    } catch (err) {}

    const $bests = document.getElementById('bests')
    const $worsts = document.getElementById('worsts')
    const $cards = document.getElementById('cards')

    updateStatus([$bests, $worsts, $cards], 'loading')
    let accents = await getData('/api/stocks/accents')
    if (accents.length === 0) return
    accents = removeSmallCaps(accents)
    accents.forEach(stock => {
      const direction = stock.relVariation > 0 ? 'positive' : 'negative'
      const id = stock.relVariation > 0 ? 'bests' : 'worsts'
      const bullet = createComponent('cmp-bullet', { direction, slug: stock.stockUrl }, [
        createComponent('span', { slot: 'head' }, [stock.market]),
        createComponent('span', { slot: 'name' }, [stock.name]),
        createComponent('span', { slot: 'value' }, [stock.relVariation]),
        createComponent('span', { slot: 'footer' }, [stock.name])
      ])
      document.getElementById(id).appendChild(bullet)
    })
    updateStatus([$bests, $worsts, $cards], 'success')


    const $perfUp = document.getElementById('performance-up')
    updateStatus([$perfUp], 'loading')
    const bestPerformance = await getData('/api/stocks/performance/up')

    printStockList(bestPerformance, $perfUp, 'perf1M')
    updateStatus([$perfUp], 'success')

    const $perfDown = document.getElementById('performance-down')
    updateStatus([$perfDown], 'loading')
    const worstPerformance = await getData('/api/stocks/performance/down')

    printStockList(worstPerformance, $perfDown, 'perf1M')
    updateStatus([$perfDown], 'success')

  }
}
