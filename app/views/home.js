import { createComponent, getData, removeSmallCaps } from '../scripts/globals.js'

export default  {
  init: async() => {
    const cssModule = await import('./home.css', {
      with: { type: 'css' }
    })
    try {
      document.adoptedStyleSheets = [cssModule.default]
    // eslint-disable-next-line no-unused-vars, no-empty
    } catch (err) {}

    let accents = await getData('/api/stocks/accents')

    if (accents.length === 0) return

    accents = removeSmallCaps(accents)

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
  }
}
