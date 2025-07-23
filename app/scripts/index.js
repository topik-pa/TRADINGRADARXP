import mainMenu from '../views/components/shared/header/main-menu/main-menu.js'

const pageId = document.body.id

mainMenu.toggleMobileMenu()


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
