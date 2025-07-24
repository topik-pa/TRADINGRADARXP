function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => { func.apply(this, args) }, timeout)
  }
}

const gotoTop = {
  init: () => {
    const gotoTopBtn = document.getElementById('goto_top')
    if (!gotoTopBtn) return
    const visibilityLimit = 200
    const classValue = 'visible'
    function toggleVisibility() {
      if (window.scrollY >= visibilityLimit) {
        gotoTopBtn.classList.add(classValue)
      } else {
        gotoTopBtn.classList.remove(classValue)
      }
    }

    window.addEventListener('scroll', debounce(toggleVisibility))

    gotoTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }
}

export default gotoTop
