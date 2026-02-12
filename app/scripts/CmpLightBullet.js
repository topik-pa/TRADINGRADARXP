const template = document.createElement('template')
template.innerHTML = `
  <style>
    .bullet {
      border: 1px solid var(--blue);
      background-color: var(--lightest-gray);
      background: linear-gradient(22deg,rgba(234, 233, 230, .15) 50%, rgba(212, 211, 208, .15) 100%);
      border-bottom: 8px solid var(--blue);
      border-radius: var(--border-radius-small);
      width: 100%;
      min-width: 18rem;
      &.positive {
        background-color: var(--green);
        background: linear-gradient(22deg,rgba(153, 255, 204, .15) 50%, rgba(0, 158, 79, .15) 100%);
        border-color: var(--green);
        .value {
          color: var(--green);
        }
      }
      &.negative {
        background-color: var(--red);
        background: linear-gradient(22deg,rgba(255, 161, 165, .15) 50%, rgba(205, 33, 42, .15) 100%);
        border-color: var(--red);
        .value {
          color: var(--red);
        }
      }
    }
    .head {
      padding: var(--main-padding) var(--main-padding) var(--x-large-space) var(--main-padding);
      font-weight: 500;
      color: var(--darkest-gray)
    }
    .name {
      padding: 0 var(--main-padding);
      color: var(--secondary);
      font-size: var(--font-size-big);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .value {
      padding: var(--x-small-space) var(--main-padding);
      font-size: var(--font-size-biggest);
      font-style: italic;
      font-weight: bold;
      text-shadow: 0 1px 0px var(--darkest-gray);
    }
    @media screen and (max-width: 430px) {
      .bullet {
        width: 100%;
      }
    }
  </style>
  <div class="bullet">
    <header class="head">
      <slot name="head"></slot>
    </header>
    <div class="name">
      <slot name="name"></slot>
    </div>
    <div class="value">
      <slot name="value"></slot>
    </div>
  </div>
`

class CmpLightBullet extends HTMLElement {

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.shadow.append(template.content.cloneNode(true))
    this.root = this.shadow.querySelector('div')
  }

  connectedCallback() {
    this.root.classList.add(this.getAttribute('direction'))
  }
}

customElements.define('cmp-light-bullet', CmpLightBullet)
