const template = document.createElement('template')
template.innerHTML = `
  <style>
    section {
      background-color: var(--lighter-gray);
      border-radius: var(--border-radius-small);
      width: 100%;
      max-width: 15rem;
    }
    h3 {
      padding: var(--main-padding);
      margin-top: 0;
    }
    .name {
      padding: 0 var(--main-padding);
      font-size: var(--font-size-bigger);
    }
    .value {
      padding: 0 var(--main-padding);
      font-size: var(--font-size-biggest);
      font-style: italic;
      font-weight: bold;
    }
    .value.positive {
      color: var(--green);
    }
    .value.negative {
      color: var(--red);
    }
    footer {
      background-color: var(--lighter-gray);
      filter: brightness(80%);
      margin-top: var(--normal-space);
      padding: var(--xx-small-space);
      display: flex;
      justify-content: end;
    }
  </style>
  <section>
    <h3>
      <slot name="title"></slot>
    </h3>
    <div class="name">
      <slot name="name"></slot>
    </div>
    <div class="value">
      <slot name="value"></slot>
    </div>
    <footer>See more...</footer>
  </section>
`

class CmpBullet extends HTMLElement {

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.append(template.content.cloneNode(true))
    const root = shadow.querySelector('section')
    root.classList.add(this.getAttribute('type'))
    root.classList.add(this.getAttribute('topic'))
    root.querySelector('.value').classList.add(this.getAttribute('direction'))
  }
}

customElements.define('cmp-bullet', CmpBullet)
