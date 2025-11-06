const template = document.createElement('template')
template.innerHTML = `
  <style>
    .bullet {
      border: 1px solid var(--darker-gray);
      background-color: var(--lightest-gray);
      background: linear-gradient(22deg,rgba(234, 233, 230, .15) 50%, rgba(212, 211, 208, .15) 100%);
      border-radius: var(--border-radius-small);
      width: 100%;
      min-width: 16rem;
      .name a {
        text-decoration: underline;
        text-decoration-color: var(--dark-gray);
        text-decoration-thickness: 1px;
      }
      &.positive {
        background-color: var(--green);
        background: linear-gradient(22deg,rgba(153, 255, 204, .15) 50%, rgba(0, 158, 79, .15) 100%);
        .value {
          color: var(--green);
        }
      }
      &.negative {
        background-color: var(--red);
        background: linear-gradient(22deg,rgba(255, 161, 165, .15) 50%, rgba(205, 33, 42, .15) 100%);
        .value {
          color: var(--red);
        }
      }
    }
    .head {
      padding: var(--main-padding) var(--main-padding) var(--x-large-space) var(--main-padding);
      font-weight: 500;
      color: var(--darker-gray)
    }
    .name {
      padding: 0 var(--main-padding);
      a {
        color: var(--secondary);
        font-size: var(--font-size-big);
        font-weight: 500;
        text-decoration: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .value {
      padding: var(--x-small-space) var(--main-padding);
      font-size: var(--font-size-biggest);
      font-style: italic;
      font-weight: bold;
      text-shadow: 0 1px 0px var(--darkest-gray);
    }
    .lastmod {
      padding: var(--x-small-space) var(--main-padding);
      font-size: var(--font-size-x-small);
      color: var(--dark-gray);
      font-style: italic;
    }
    footer {
      background-color: var(--darkest-gray);
      padding: var(--x-small-space);
      display: flex;
      justify-content: end;
      a {
        color: var(--primary);
        font-size: var(--font-size-x-small);
        text-shadow: 0 1px 0px var(--darkest-gray);
        &:hover {
          font-style: italic;
        }
      }
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
      <a href="#"><slot name="name"></slot></a>
    </div>
    <div class="value">
      <slot name="value"></slot><small>%</small>
    </div>
    <div class="lastmod">
      <slot name="lastmod"></slot>
    </div>
    <footer>
      <a href="#"><slot name="footer"></slot>&nbsp;<span>&#10148;</span></a>
    </footer>
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
    this.root.classList.add(this.getAttribute('direction'))
    this.root.querySelectorAll('a').forEach((el) => {el.href = this.getAttribute('slug')})
  }
}

customElements.define('cmp-bullet', CmpBullet)
