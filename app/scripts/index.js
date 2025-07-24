import mainMenu from '../views/components/shared/header/main-menu/main-menu.js'
import gotoTop from '../views/components/shared/goto_top/goto_top.js'

const pageId = document.body.id

mainMenu.toggleMobileMenu()
gotoTop.init()


const modules = {
  hp: () => import('../views/home.js')
}

if (modules[pageId]) {
  modules[pageId]().then((module) => {
    module.default?.init?.()
  }).catch((err) => {
    console.warn(err)
  })
}
