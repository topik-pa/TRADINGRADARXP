const mainMenu = {
  toggleMobileMenu: () => {
    const $view = document.documentElement
    const $root = document.getElementById('main-menu')
    const $hamburger = document.querySelector('header .hamburger')
    const $closeMenu = $root.querySelector('.close')

    $view.addEventListener('click', (e) => {
      if (e.target === $hamburger) {
        $root.classList.toggle('show')
        return
      }
      if (e.target === $closeMenu) {
        $root.classList.remove('show')
        return
      }

      let parent = e.target.parentNode
      let toBeClosed = true
      while (parent) {
        if (parent === $root) {
          toBeClosed = false
          break
        } else {
          parent = parent.parentNode
        }
      }
      if (toBeClosed) {
        $root.classList.remove('show')
      }
    })
  }
}

export default mainMenu
