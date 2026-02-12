import mainMenu from '../views/components/shared/header/main-menu/main-menu.js'
import gotoTop from '../views/components/shared/goto_top/goto_top.js'
import column from '../views/components/shared/column/column.js'
import './CmpBullet.js'
import './CmpLightBullet.js'
import './CmpCard.js'
import './CmpNavigation.js'
import { avaBannerManagement } from './avaBannerManagement.js'
import cookieLayer from '../views/components/shared/cookie_layer/cookie_layer.js'

const pageId = document.body.id
const lang = document.documentElement.lang

mainMenu.toggleMobileMenu()
gotoTop.init()
column.init()
cookieLayer.init()

// Import views specific scripts
const modules = {
  hp: () => import('../views/home.js'),
  exchange: () => import('../views/exchange.js'),
  stock: () => import('../views/stock.js'),
  stocks: () => import('../views/stocks.js')
}

// Execute view specific script
if (modules[pageId]) {
  modules[pageId]().then((module) => {
    module.default?.init?.()
  }).catch((_err) => {
    // console.warn(err)
  })
}

function setUpdateValue() {
  const updates = document.getElementsByClassName('update')
  for (const item of updates) {
    item.children[0].innerText = new Date().toLocaleDateString(lang ,{ weekday:'long', day:'numeric', month:'long' })
  }
}
setUpdateValue()

avaBannerManagement(lang)
