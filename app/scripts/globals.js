/* eslint-disable no-console */

const STATUS = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error'
}

export function updateStatus(targets, status) {
  targets.forEach((target) => {
    target.classList.remove(...Object.values(STATUS))
    target.classList.add(STATUS[status])
  })
}

export function createComponent(tag, attrs = {}, children = []) {
  const el = document.createElement(tag)
  // Imposta attributi
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value)
  }
  // Aggiunge i figli (contenuto, slot, ecc.)
  for (const child of children) {
    if (!child) continue
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(child))
    } else {
      el.appendChild(child)
    }
  }
  return el
}

export async function getData(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error(`Response status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(error.message)
  }
}

export function removeSmallCaps(stocks) {
  return stocks.filter((s) => {
    if(s.volume !== null && s.price !== null) {
      return s.volume * s.price >= 1_000_000
    }
  })
}

export function printStockList(stocks, $target, key) {
  stocks.forEach((stock) => {
    const $li = document.createElement('li')
    const $a = document.createElement('a')
    $a.innerText = stock.name
    $a.title = stock.name
    $a.href = stock.stockUrl
    const $span = document.createElement('span')
    $span.innerText = stock[key] + '%' || ''
    $li.appendChild($a)
    $li.appendChild($span)
    $target.appendChild($li)
  })
}
