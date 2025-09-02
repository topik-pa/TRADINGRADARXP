import { createComponent, getData } from '../scripts/globals.js'

// function getHighlights(stocks) {
//   let worst = stocks[0]
//   let best = stocks[0]
//   stocks.forEach(stock => {
//     if (stock.relVariation > best.relVariation) {
//       best = stock
//     }
//     if (stock.relVariation < worst.relVariation) {
//       worst = stock
//     }
//   })
//   return { worst, best }
// }


export default  {
  init: async() => {
    const cssModule = await import('./exchange.css', {
      with: { type: 'css' }
    })
    try {
      document.adoptedStyleSheets = [cssModule.default]
    // eslint-disable-next-line no-empty
    } catch (err) {}

    const exchange = document.body.dataset.exchange

    // const stocks = await getData('/api/stocks/' + exchange)
    // if (stocks.length !== 0) {
    //   const { worst, best } = getHighlights(stocks)

    //   const bestBullet = createComponent('cmp-bullet', { direction: 'positive' }, [
    //     createComponent('span', { slot: 'title' }, ['In evidenza']),
    //     createComponent('span', { slot: 'name' }, [best.name]),
    //     createComponent('span', { slot: 'value' }, [best.relVariation])
    //   ])
    //   document.getElementById('highlights-up').appendChild(bestBullet)

    //   const worstBullet = createComponent('cmp-bullet', { direction: 'negative' }, [
    //     createComponent('span', { slot: 'title' }, ['In evidenza']),
    //     createComponent('span', { slot: 'name' }, [worst.name]),
    //     createComponent('span', { slot: 'value' }, [worst.relVariation])
    //   ])
    //   document.getElementById('highlights-down').appendChild(worstBullet)
    // }

    let accents = await getData('/api/stocks/accents/' + exchange)

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


    const bestPerformance = await getData('/api/stocks/performance/' + exchange + '/' + 'up')
    bestPerformance.forEach(stock => {
      const direction = stock.relVariation > 0 ? 'positive' : 'negative'
      const bullet = createComponent('cmp-bullet', { direction: direction }, [
        createComponent('span', { slot: 'title' }, ['In evidenza']),
        createComponent('span', { slot: 'name' }, [stock.name]),
        createComponent('span', { slot: 'value' }, [stock.relVariation])
      ])
      document.getElementById('performance-up').appendChild(bullet)
    })

    const wostPerformance = await getData('/api/stocks/performance/' + exchange + '/' + 'down')
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
