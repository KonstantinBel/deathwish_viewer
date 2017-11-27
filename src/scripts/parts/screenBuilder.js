const moduleWorker = require('./moduleWorker.js')

let mainScreenSet = require('../../blocks-sets/main-screen/main-screen')
let viewerScreenSet = require('../../blocks-sets/viewer-screen/viewer-screen')
let preloaderSlider = require('../../blocks/preloader-slider/preloader-slider')
let preloaderViewer = require('../../blocks/preloader-viewer/preloader-viewer')

let mianScreenDiscription = require('../../blocks/mian-screen-discription/mian-screen-discription')

let booksBolck = require('../../blocks/books-block/books-block')
let bookSlider = require('../../blocks/book-slider/book-slider')

let partsPreviewer = require('../../blocks/parts-previewer/parts-previewer')

let mainVeiwer = require('../../blocks/main-viewer/main-viewer')
let mainVeiwerSet = require('../../blocks/main-viewer/__hiddens/main-veiwer__hiddens')
let mainVeiwerNav = require('../../blocks/main-viewer/__nav/main-viewer__nav')

let screenContainer = document.getElementById('screen-container')

let bookDbController
let builder = {}

function setDbController (dbController) {
  bookDbController = dbController
}

function setUrl (funcName, args) {
  args = args[0] ? [].slice.call(args[0]).join('&') : null
  let url = '#' + funcName + (args ? '&' + args : '')
  // window.location.hash = url
  history.pushState({path: url}, '', url)
}

builder.getScreen = function (url) { // 'funcName&arg1&arg2&...'
  let params = url.split('&')
  params.push('prevUrl')

  // если вызов билдеров идет из этой функции, не нужно вызывать setUrl
  try {
    builder[params[0]](params.slice(1))
  } catch (err) {
    if (err.message.includes('is not a function')) {
      builder.buildMainScreen()
      console.error('Wrong url: ' + url)
    } else {
      console.error(err.stack)
    }
  }
}

function clearScreenContainer () {
  screenContainer.dataset.struct = ''
  screenContainer.dataset.screen = ''
  screenContainer.innerHTML = ''
}

function clearSlots () {
  document.querySelectorAll('.slot').forEach(item => {
    item.innerHTML = ''
  })
}

// Build static sets

function buildMainScreenSet () {
  return Promise.resolve()
    .then(() => {
      clearScreenContainer()
      screenContainer.dataset.struct = 'main-screen-set'
      return screenContainer
    })
    .then(elem => {
      return moduleWorker.insert({
        block: mainScreenSet.get(),
        position: 'inside',
        target: screenContainer
      })
    })
    .catch((error) => console.error(error))
}

function buildViewerScreenSet () {
  return Promise.resolve()
    .then(() => {
      clearScreenContainer()
      screenContainer.dataset.struct = 'viewer-screen-set'
      return screenContainer
    })
    .then(() => {
      return moduleWorker.insert({
        block: viewerScreenSet.get(),
        position: 'inside',
        target: screenContainer
      })
    })
    .catch((error) => console.error(error))
}

builder.buildMainScreen = function ([prevUrl]) {
  if (!prevUrl) setUrl('buildMainScreen', arguments)
  window.stop()

  Promise.resolve()
    .then(() => {
      if (screenContainer.dataset.struct === 'main-screen-set') {
        clearSlots()
      } else {
        return buildMainScreenSet()
      }
    })
    .then(() => {
      screenContainer.dataset.screen = 'main-screen'
    })
    .then(() => {
      return moduleWorker.insert({
        block: mianScreenDiscription.get(),
        position: 'inside',
        target: document.getElementById('main-content'),
        data: {text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus quam porro, maiores assumenda, distinctio facilis ex ullam sint iure ipsam nemo nisi repudiandae iste aliquid placeat laboriosam neque quibusdam nesciunt.'}
      })
    })
    .then(elem => {
      return moduleWorker.insert({
        block: booksBolck.get(),
        position: 'after',
        target: elem
      })
    })
    .then(elem => {
      let books = bookDbController.getBooksCounter();

      (function createModule (counter) {
        if (counter >= books) return

        moduleWorker.insert({
          block: bookSlider.get(),
          position: 'inside',
          target: elem,
          data: bookDbController.getBook(counter),
          blockPreload: preloaderSlider.get()
        })
          .then(res => createModule(counter += 1))
      })(0)
    })
    .catch(error => console.error(error))
}

builder.buildPartsViewer = function ([bookName, issueName, prevUrl]) {
  if (!prevUrl) setUrl('buildPartsViewer', arguments)
  window.stop()

  Promise.resolve()
    .then(() => {
      if (screenContainer.dataset.struct === 'main-screen-set') {
        clearSlots()
      } else {
        return buildMainScreenSet()
      }
    })
    .then(() => {
      screenContainer.dataset.screen = 'parts-screen'
    })
    .then(() => {
      return moduleWorker.insert({
        block: partsPreviewer.get(),
        position: 'inside',
        target: document.getElementById('main-content'),
        data: bookDbController.getMinParts(bookName, issueName)
      })
    })
    .catch(error => console.error(error))
}

builder.buildMainVeiwer = function ([bookName, issueName, number, prevUrl]) {
  if (!prevUrl) setUrl('buildMainVeiwer', arguments)
  window.stop()

  Promise.resolve()
    .then(() => {
      if (screenContainer.dataset.struct === 'viewer-screen-set') {
        clearSlots()
      } else {
        return buildViewerScreenSet()
      }
    })
    .then(() => {
      screenContainer.dataset.screen = 'main-slider'
    })
    .then(elem => {
      return moduleWorker.insert({
        block: mainVeiwer.get(),
        position: 'inside',
        target: document.getElementById('pats-slider'),
        data: bookDbController.getPart(bookName, issueName, number),
        blockPreload: preloaderViewer.get()
      })
    })
    .then(() => {
      return moduleWorker.insert({
        block: mainVeiwerNav.get(),
        position: 'inside',
        target: document.getElementById('main-viewer__nav'),
        data: bookDbController.getPartsSet(bookName, issueName)
      })
    })
    .then(elem => {
      moduleWorker.insert({
        block: mainVeiwerSet.get(),
        position: 'after',
        target: elem,
        data: bookDbController.getPartsSet(bookName, issueName)
      })
    })
    .catch(error => console.error(error))
}

module.exports = {
  'setDbController': setDbController,
  'builder': builder
}
