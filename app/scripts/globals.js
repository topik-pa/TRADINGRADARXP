/* eslint-disable no-console */

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
      throw new Error(`Response status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(error.message)
  }
}

export function removeSmallCaps(stocks) {
  return stocks.filter((s) => {
    if(s.volume !== null && s.price !== null) {
      return s.volume * s.price >= 10_000
    }
  })
}
