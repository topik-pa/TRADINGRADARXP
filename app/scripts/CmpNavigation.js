const template = document.createElement('template')
template.innerHTML = `
  <style>
    nav {
      background-color: var(--darker-gray);
      color: var(--lightest-gray);
    }
    h4 {
      margin: 0;
      text-transform: uppercase;
      background-color: var(--darkest-gray);
      padding: var(--main-padding);
    }
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      font-weight: 500;
      font-size: var(--font-size-big);
    }
  </style>
  <nav>
    <h4>
      <slot name="title"></slot>
    </h4>
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
