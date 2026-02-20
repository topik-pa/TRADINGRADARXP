const template = document.createElement('template')
template.innerHTML = `
  <style>
    .bullet {
      border: 1px solid var(--darker-gray);
      background-color: var(--lightest-gray);
      background: linear-gradient(22deg,rgba(234, 233, 230, .15) 50%, rgba(212, 211, 208, .15) 100%);
      border-radius: var(--border-radius-small);
      width: 100%;
      min-width: 20rem;
      max-width: 24rem;
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
      color: var(--darker-gray);
      position:relative
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
    .market {
        color: var(--darkest-gray);
        /*width: 18ch;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;*/
    }
    .status {
        display: block;
        font-size: var(--font-size-x-small);
        margin-top: var(--xx-small-space);
    }
    .bigcap {
        display: block;
        font-size: var(--font-size-x-small);
        position: absolute;
        right: var(--main-padding);
        top: var(--main-padding);
        background-color: var(--blue);
        padding: var(--xx-small-space);
        border-radius: var(--border-radius-small);
        color: var(--white);
    }
    .hide {
      display: none!important;
    }
    @media screen and (max-width: 430px) {
      .bullet {
        width: 100%;
      }
    }
  </style>
  <div class="bullet">
    <header class="head">
      <span class="market"><slot name="market"></slot></span>
      <span class="status"></span>
      <span class="bigcap hide"></span>
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
    this.root.querySelectorAll('a').forEach((el) => {el.href = this.getAttribute('url')})
    this.root.querySelector('.status').innerText = this.getAttribute('status')
    if (this.getAttribute('isBigCap') !== 'nope') {
      const bigcapEl = this.root.querySelector('.bigcap')
      bigcapEl.innerText = this.getAttribute('isBigCap')
      bigcapEl.classList.remove('hide')
    }
  }
}

customElements.define('cmp-bullet', CmpBullet)
