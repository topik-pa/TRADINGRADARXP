import {
  createComponent,
  getData,
  removeSmallCaps,
  updateStatus,
  printStockList,
  printJSONLD
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

    const lang = document.documentElement.lang
    const $bests = document.getElementById('bests')
    const $worsts = document.getElementById('worsts')
    const $cards = document.getElementById('cards')

    updateStatus([$bests, $worsts, $cards], 'loading')
    let accents = await getData('/api/stocks/accents')
    if (accents.length !== 0) {
      accents = removeSmallCaps(accents)
      accents.forEach(stock => {
        const isBigCap = stock.cap > 3000
        const direction = stock.relVariation > 0 ? 'positive' : 'negative'
        const id = stock.relVariation > 0 ? 'bests' : 'worsts'
        const bullet = createComponent('cmp-bullet', {
          direction,
          url: '/'+lang+'/'+stock.slug,
          status: 'Status: '+(stock.status || 'N/A'),
          isBigCap: isBigCap ? 'BIG CAP' : 'nope'
        }, [
          createComponent('span', { slot: 'market' }, [stock.market]),
          createComponent('span', { slot: 'name' }, [stock.name]),
          createComponent('span', { slot: 'value' }, [stock.relVariation]),
          createComponent('span', { slot: 'lastmod' }, [stock.lastTrade]),
          createComponent('span', { slot: 'footer' }, [stock.name])
        ])
        document.getElementById(id).appendChild(bullet)
      })
    }
    if($bests.children.length === 0) {
      const bullet = createComponent('cmp-light-bullet', { }, [
        createComponent('span', { slot: 'name' }, ['No data'])
      ])
      $bests.appendChild(bullet)
    }
    if($worsts.children.length === 0) {
      const bullet = createComponent('cmp-light-bullet', { }, [
        createComponent('span', { slot: 'name' }, ['No data'])
      ])
      $worsts.appendChild(bullet)
    }
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


    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `https://rallyingstocks.com/${lang}/#webpage`,
      'name': document.querySelector('title')?.innerText || '',
      'url': `https://rallyingstocks.com/${lang}`,
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
