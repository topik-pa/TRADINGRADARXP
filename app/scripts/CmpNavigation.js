const template = document.createElement('template')
template.innerHTML = `
  <style>
    nav {
      background-color: var(--black);
      font-size: var(--font-size-small);
    }
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      font-weight: 500;
    }
  </style>
  <nav>
    <ul>
      <slot name="list"></slot>
    </ul>
  </nav>
`

class CmpNavigation extends HTMLElement {

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.append(template.content.cloneNode(true))
    //const root = shadow.querySelector('section')
    //root.classList.add(this.getAttribute('color'))
    //root.classList.add(this.getAttribute('topic'))
    //root.querySelector('header').classList.add(this.getAttribute('color'))
    //root.querySelector('img').setAttribute('src', this.getAttribute('src'))
  }
}

customElements.define('cmp-navigation', CmpNavigation)
