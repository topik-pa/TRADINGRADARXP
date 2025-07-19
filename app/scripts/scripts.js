const pageId = document.body.id

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
