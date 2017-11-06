module.exports =
`
<div class="book-slider">
  <header class="book-slider__head">
    <img src="{{srcBookPreviwe}}" alt="{{altBookPreviwe}}">
    <h2>{{bookName}}</h2>
  </header>
  <div class="book-slider__backBtn">
    &#8647;
  </div>
  <div class="book-slider__slider" data-book-name="{{bookName}}">
    <ul class="book-slider__slideList" data-shift="0">
      {{#issues}}
      <li class="book-slider__slideItem" data-issue-name="{{issueName}}">
        <img src="{{srcIssuePreviwe}}" alt="{{altIssuePreviwe}}">
        <h3>{{issueName}}</h3>
      </li>
      {{/issues}}
    </ul>
  </div>
  <div class="book-slider__forwardBtn">
    &#8649;
  </div>
</div>
`

document.addEventListener('click', e => {
  let trg = e.target

  if (isClass(trg, 'book-slider__forwardBtn')) {
    e.preventDefault()
    let bookModule = trg.closest('.book-slider')
    slideBookModule(bookModule, -216)
    return
  }

  if (isClass(trg, 'book-slider__backBtn')) {
    e.preventDefault()
    let bookModule = trg.closest('.book-slider')
    slideBookModule(bookModule, 216)
    return
  }

  let el = isClass(trg, 'book-slider__slideItem')
  if (el) {
    let event = new CustomEvent('callPartsVeiwerScreen', {
      detail: {
        issueName: el.dataset.issueName,
        bookName: el.closest('.book-slider__slider').dataset.bookName
      },
      bubbles: true
    })

    document.dispatchEvent(event)
  }
})

function isClass (elem, selector) {
  return elem.classList.contains(selector) ? elem : elem.closest('.' + selector)
}

function slideBookModule (bookModule, shift) {
  let slider = bookModule.querySelector('.book-slider__slider')
  let slideList = bookModule.querySelector('.book-slider__slideList')

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
