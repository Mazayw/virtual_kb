import lang from './layouts/index.js';
import layout from './layouts/layout.js';

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
    capsLock: false,
    shift: false,
    value: '',
  },

  init() {
    this.elements.main = document.createElement('div');
    this.elements.main.classList.add('keyboard');
    this.elements.main.appendChild(this._createKeys());
    this.elements.textarea = document.createElement('textarea');
    this.elements.textarea.setAttribute('placeholder', 'Start typing...');
    this.elements.textarea.setAttribute('readonly', '');
    //this.elements.textarea.setAttribute('wrap', 'off');
    //this.elements.textarea.setAttribute('autocorrect', 'off');
    this.elements.text = document.createElement('p');
    this.elements.text.textContent =
      'Toggle language: Left Shift + Left Ctrl. Designed for Windows';
    document.body.prepend(this.elements.text);
    document.body.prepend(this.elements.main);
    document.body.prepend(this.elements.textarea);
    this._createKeys();
    this.elements.keys = document.getElementsByClassName('keyboard__key');
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

        switch (key) {
          case 'ShiftRight':
          case 'ShiftLeft':
          case 'CapsLock':
            keyElement.addEventListener('click', () => {
              this.properties.capsLock = !this.properties.capsLock;
              this.properties.shift = !this.properties.shift;
              const caps = document.querySelector('.key_CapsLock');
              caps.classList.toggle('key_CapsLock--active');
              this._switch();
            });
            break;

          case 'Backspace':
          case 'Delete':
            keyElement.addEventListener('click', () => {
              this.properties.value = this.properties.value.slice(0, -1);
              this._triggerEvent();
            });
            break;

          case 'Tab':
            keyElement.addEventListener('click', () => {
              this.properties.value += '   ';
              this._triggerEvent();
            });
            break;

          case 'Enter':
            keyElement.addEventListener('click', () => {
              this.properties.value += '\n';
              this._triggerEvent();
            });
            break;

          case 'Space':
            keyElement.addEventListener('click', () => {
              this.properties.value += ' ';
              this._triggerEvent();
            });
            break;

          default:
            //if (keyData.shift !== keyData.small) {
            if (keyElement.innerHTML.length < 2) {
              keyElement.addEventListener('click', () => {
                this.properties.value += keyElement.textContent;
                this._triggerEvent();
              });
            }

            break;
        }

        keysRow.appendChild(keyElement);
      });

      fragment.appendChild(keysRow);
    });
    return fragment;
  },

  _triggerEvent() {
    const valueNode = document.getElementsByTagName('textarea')[0];
    valueNode.innerHTML = this.properties.value;
  },

  _capsLock() {
    const keys = document.getElementsByClassName('keyboard__key');
    if (this.properties.capsLock) {
      for (let key of keys) {
        if (key.innerHTML.length == 1) {
          key.innerHTML = key.innerHTML.toUpperCase();
        }
      }
    } else {
      for (let key of keys) {
        if (key.innerHTML.length == 1) {
          key.innerHTML = key.innerHTML.toLowerCase();
        }
      }
    }
  },

  _switch() {
    const keys = document.getElementsByClassName('keyboard__key');
    for (let key of keys) {
      const keyData = lang[`${this.properties.lang}`].find(
        (el) => el.code == key.dataset.keycode
      );
      key.innerHTML = this.properties.shift ? keyData.shift : keyData.small;
    }
  },

  //Add listeners typing
};

window.addEventListener('DOMContentLoaded', function () {
  Keyboard.init();
});
