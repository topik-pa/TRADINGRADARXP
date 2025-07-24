const column = {
  init: () => {
    const colcollapse = document.getElementById('colcollapse')
    if (!colcollapse) return
    const column = document.querySelector('.layout > aside')

    colcollapse.addEventListener('click', () => {
      column.classList.toggle('collapsed')
    })
  }
}

export default column
