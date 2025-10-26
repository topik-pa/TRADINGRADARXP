const template = document.createElement('template')
template.innerHTML = `
  <style>
    section {
      border-bottom: 1px solid var(--light-gray);
      width: 16rem;
    }
    header {
      border-top-left-radius: var(--border-radius-small);
      border-top-right-radius: var(--border-radius-small);
      padding: var(--main-padding);
      text-transform: uppercase;
      color: var(--white);
      background-color: #B0ACAC;
      background: linear-gradient(90deg,rgba(63, 101, 128, 1) 50%, rgba(29, 84, 124, 1) 100%);
      text-shadow: var(--text-shadow);
    }
    h3 {
      margin: 0;
      font-size: 1rem;
    }
    main {
      background-color: var(--light-gray);
      background: linear-gradient(180deg,rgba(169, 169, 169, 1) 33%, rgba(252, 252, 252, 1) 100%);
      padding: var(--main-padding);
    }
    footer {
      padding: var(--main-padding);
      display: flex;
      justify-content: end;
      font-weight: 500;
    }
    @media screen and (max-width: 768px) {
      section {
        width: 100%;
      }
    }
  </style>
  <section>
    <header>
      <h3>
        <slot name="title"></slot>
      </h3>
    </header>
    <main>
      <!--<slot name="image"></slot>-->
      <h4>
        <slot name="subtitle"></slot>
      </h4>
      <p>
        <slot name="description"></slot>
      </p>
    </main>
    <footer>
      <slot name="link"></slot>
    </footer>
  </section>
`

class CmpCard extends HTMLElement {

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.append(template.content.cloneNode(true))
    const root = shadow.querySelector('section')
    //root.classList.add(this.getAttribute('color'))
    //root.classList.add(this.getAttribute('topic'))
    root.querySelector('header').classList.add(this.getAttribute('color'))
    //root.querySelector('img').setAttribute('src', this.getAttribute('src'))
  }
}

customElements.define('cmp-card', CmpCard)
