function init () {
  document.addEventListener('click', e => {
    let trg = e.target
    let el

    if (isClass(trg, 'books-module__forwardBtn')) {
      e.preventDefault()
      let bookModule = trg.closest('.books-module')
      slideBookModule(bookModule, -216)
      return
    }

    if (isClass(trg, 'books-module__backBtn')) {
      e.preventDefault()
      let bookModule = trg.closest('.books-module')
      slideBookModule(bookModule, 216)
      return
    }

    if (el = isClass(trg, 'books-module__slideItem')) {
      let event = new CustomEvent('callPageSelectScreen', {
        detail: {
          url: el.dataset.issue_url,
          count: el.dataset.issue_count
        }
      })

      document.dispatchEvent(event)
    }
  })

  function isClass (elem, selector) {
    return elem.classList.contains(selector) ? elem : elem.closest('.' + selector)
  }

  function slideBookModule (bookModule, shift) {
    let slider = bookModule.querySelector('.books-module__slider')
    let slideList = bookModule.querySelector('.books-module__slideList')

    let sliderWidth = slider.getBoundingClientRect().width
    let slideListWidth = slideList.getBoundingClientRect().width

    let currShift = parseInt(slideList.dataset.shift)
    let left = currShift + shift

    if (left > 0) {
      slideList.style.transform = `translatex(0px)`
      slideList.dataset.shift = 0
      return
    }

    if (left < (sliderWidth - slideListWidth)) {
      slideList.style.transform = `translatex(${-(slideListWidth - sliderWidth)}px)`
      slideList.dataset.shift = -(slideListWidth - sliderWidth)
      return
    }

    slideList.style.transform = `translatex(${left}px)`
    slideList.dataset.shift = left
  }
}

module.exports.init = init
