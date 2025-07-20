export default  {
  init: async () => {
    const cssModule = await import('../views/home.css', {
      with: { type: 'css' }
    });
    try {
      document.adoptedStyleSheets = [cssModule.default];
    } catch (error) {}
    // import('../views/home.css')
  }
}
