import mainMenu from '../views/components/shared/header/main-menu/main-menu.js'
import gotoTop from '../views/components/shared/goto_top/goto_top.js'
import column from '../views/components/shared/column/column.js'
import './CmpBullet.js'
import './CmpCard.js'
import './CmpNavigation.js'

const pageId = document.body.id

mainMenu.toggleMobileMenu()
gotoTop.init()
column.init()

// Import views specific scripts
const modules = {
  hp: () => import('../views/home.js'),
  exchange: () => import('../views/exchange.js')
}

// Execute view specific script
if (modules[pageId]) {
  modules[pageId]().then((module) => {
    module.default?.init?.()
  }).catch((_err) => {
    // console.warn(err)
  })
}
