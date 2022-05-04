import lang from './layouts/index.js';
import layout from './layouts/layout.js';

console.log(layout);
class Key {
  constructor({ small, shift, code, size }) {
    this.small = small;
    this.shift = shift;
    this.code = code;
    this.size = size;
    this.isFnBtn = small == shift;
  }
}

const Keyboard = {
  elements: {
    main: null,
    textarea: null,
    text: null,
    keys: [],
  },
  //
  properties: {
    lang: 'en',
    capslock: false,
    shift: false,
    value: '',
  },

  init() {
    this.elements.main = document.createElement('div');
    this.elements.main.classList.add('keyboard');
    this.elements.main.appendChild(this._createKeys());
    this.elements.textarea = document.createElement('textarea');
    this.elements.textarea.setAttribute('placeholder', 'Start typing...');
    this.elements.text = document.createElement('p');
    this.elements.text.textContent =
      'Toggle language: Left Shift + Left Ctrl. Designed for Windows';
    document.body.prepend(this.elements.text);
    document.body.prepend(this.elements.main);
    document.body.prepend(this.elements.textarea);
    this._createKeys();
  },

  _getKeys() {
    this.elements.keys = [];
    const param = this.properties.shift ? 'shift' : 'small';
    lang[`${this.properties.lang}`].forEach((el) => {
      this.elements.keys.push(el[`${param}`]);
    });
  },

  _createKeys() {
    let fragment = document.createDocumentFragment();
    layout.forEach((row, index) => {
      const keysRow = document.createElement('div');
      keysRow.classList.add(`keyboard__row`, `row_${index + 1}`);
      row.forEach((key, i) => {
        const keyElement = document.createElement('button');
        const keyData = lang[`${this.properties.lang}`].find(
          (el) => el.code == key
        );
        keyElement.setAttribute('type', 'button');
        keyElement.classList.add('keyboard__key', `key_${keyData.code}`);
        keyElement.setAttribute('data-keycode', `${keyData.code}`);
        keyElement.innerHTML = keyData.small;
        keysRow.appendChild(keyElement);
      });

      fragment.appendChild(keysRow);
    });
    return fragment;
  },
};

window.addEventListener('DOMContentLoaded', function () {
  Keyboard.init();
});
