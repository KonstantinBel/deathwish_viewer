const Mustache = require('mustache')
let preloaderBlock = require('../../blocks/preloader/preloader.js')

function getElement (block, data = {}) {
  let elem = document.createElement('div')
  elem.innerHTML = Mustache.render(block, data)
  elem = elem.firstElementChild
  return elem
}

function getPreloadElement (block, data = {}) {
  return new Promise((resolve, reject) => {
    let elem = getElement(block, data)
    let counter = elem.getElementsByTagName('img').length
    if (counter === 0) resolve(elem)

    elem.addEventListener('load', e => {
      counter -= 1
      if (counter === 0) resolve(elem)
    }, true)

    elem.addEventListener('error', e => {
      counter -= 1
      console.error('Img: ' + e.path[0].baseURI + ' not load')
      if (counter === 0) resolve(elem)
    }, true)
  })
}

function getRemElement (block, query) {
  let url = `${query}`
  return fetch(url)
    .then(res => res.json())
    .then(res => getElement(block, res))
    .catch(rej => {
      console.error(rej)
      let div = document.createElement('div')
      div.setAttribute('data-render_error', '')
      return div
    })
}

function getRemPreloadElement (block, query) {
  let url = `${query}`
  return fetch(url)
    .then(res => res.json())
    .then(res => getPreloadElement(block, res))
    .catch(rej => {
      console.error(rej)
      let div = document.createElement('div')
      div.setAttribute('data-render_error', '')
      return div
    })
}

function insert ({block, position, target, data, preload, query}) {
  return new Promise((resolve, reject) => {
    if (query && preload) {
      let preloader = getElement(preloaderBlock)
      target.appendChild(preloader)
      getRemPreloadElement(block, data)
        .then(res => {
          preloader.remove()
          target.appendChild(res)
          resolve(target)
        })
        .catch(rej => reject(rej))
    } else if (query) {
      getRemElement(block, data)
        .then(res => {
          target.appendChild(res)
          resolve(target)
        })
        .catch(rej => reject(rej))
    } else if (preload) {
      let preloader = getElement(preloaderBlock)
      target.appendChild(preloader)
      getPreloadElement(block, data)
        .then(res => {
          preloader.remove()
          target.appendChild(res)
          resolve(target)
        })
        .catch(rej => reject(rej))
    } else {
      target.appendChild(getElement(block, data))
      resolve(target)
    }
  })
}

function addElem (elem, target, position) {
  if (position === 'inside') {
    target.appendChild(elem)
  } else if (position === 'before') {
    target.parentElement.insertBefore(elem, target)
  } else if (position === 'after') {
    target.parentElement.insertBefore(elem, target.nextElementSibling || target)
  }
}

module.exports = {
  'insert': insert
}
