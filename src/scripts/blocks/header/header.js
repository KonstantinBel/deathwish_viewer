import Block from '../../parts/Block'

export default class Header extends Block {
  _initBlock () {
    this.template = `
      <header class="header"><h1>Site name</h1></header>
    `
  }
}
