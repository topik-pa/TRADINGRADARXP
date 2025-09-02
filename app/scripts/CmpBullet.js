const template = document.createElement('template')
template.innerHTML = `
  <style>
    div {
      border: 1px solid var(--lighter-gray);
      background-color: var(--lighter-gray);
      border-radius: var(--border-radius-small);
      width: 18rem;
      &.positive {
        background-color: var(--green);
        background: linear-gradient(22deg,rgba(153, 255, 204, .15) 50%, rgba(0, 158, 79, .15) 100%);
        footer {
          background-color: var(--green);
        }
        .value {
          color: var(--green);
        }
      }
      &.negative {
        background-color: var(--red);
        background: linear-gradient(22deg,rgba(255, 161, 165, .15) 50%, rgba(205, 33, 42, .15) 100%);
        footer {
          background-color: var(--red);
        }
        .value {
          color: var(--red);
        }
      }
    }
    h4 {
      padding: var(--main-padding);
      margin-top: 0;
    }
    .name {
      padding: 0 var(--main-padding);
      font-size: var(--font-size-big);
      font-weight: 500;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .value {
      padding: var(--small-space) var(--main-padding);
      font-size: var(--font-size-biggest);
      font-style: italic;
      font-weight: bold;
      text-shadow: 0 1px 0px var(--darkest-gray);
    }
    footer {
      background-color: var(--lighter-gray);
      margin-top: var(--base-space);
      padding: var(--x-small-space);
      display: flex;
      justify-content: end;
      a {
        color: var(--white);
        font-weight: 500;
        font-style: italic;
      }
    }
  </style>
  <div>
    <h4>
      <slot name="title"></slot>
    </h4>
    <span class="name">
      <slot name="name"></slot>
    </span>
    <span class="value">
      <slot name="value"></slot>
    </span>
    <footer><a href="#">Scopri maggiori dettagli >> </a></footer>
  </div>
`

class CmpBullet extends HTMLElement {

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.shadow.append(template.content.cloneNode(true))
    this.root = this.shadow.querySelector('div')
  }

  connectedCallback() {
    this.root.classList.add(this.getAttribute('topic'))
    this.root.classList.add(this.getAttribute('direction'))
  }
}

customElements.define('cmp-bullet', CmpBullet)
