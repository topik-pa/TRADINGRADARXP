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



const modules = {
  hp: () => import('../views/home.js'),
  exchange: () => import('../views/exchange.js')
}

if (modules[pageId]) {
  modules[pageId]().then((module) => {
    module.default?.init?.()
  // eslint-disable-next-line no-unused-vars
  }).catch((err) => {
    // console.warn(err)
  })
}
