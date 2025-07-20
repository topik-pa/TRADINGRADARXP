export default  {
  init: async() => {
    const cssModule = await import('../views/home.css', {
      with: { type: 'css' }
    })
    try {
      document.adoptedStyleSheets = [cssModule.default]
    // eslint-disable-next-line no-unused-vars, no-empty
    } catch (err) {}
  }
}
