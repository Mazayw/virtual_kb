import lang from './layouts/index.js';
import layout from './layouts/layout.js';

class Keyboard {
  constructor() {
    this.main = document.createElement('div');
    this.textarea = document.createElement('textarea');
    this.text = document.createElement('p');

    this.lang = 'en';
    this.capsLockPressed = false;
    this.shiftPressed = false;
    this.upperCase = false;
    this.numRow = false;
    this.left = '';
    this.right = '';
    this.value = '';
    this.keys;
  }

  //Create Keyboard
  init() {
    if (localStorage.getItem('lang')) {
      this.lang = localStorage.getItem('lang');
    }
    this.main.classList.add('keyboard');
    this.main.appendChild(this._createKeys());
    this.textarea.setAttribute('placeholder', 'Start typing...');
    this.textarea.setAttribute('spellcheck', 'false');
    this.textarea.setAttribute('wrap', 'hard');
    this.text = document.createElement('p');
    this.text.textContent = `Toggle language: Left Shift + Left Ctrl. Designed for Windows. Current language: ${this.lang}`;
    document.body.prepend(this.text);
    document.body.prepend(this.main);
    document.body.prepend(this.textarea);
    this._createKeys();
    this.keys = document.getElementsByClassName('keyboard__key');

    document.addEventListener('keydown', (event) => this._onKeyDown(event));
    document.addEventListener('keyup', (event) => this._onKeyUp(event));
    this.textarea.addEventListener('click', () => this._cursorPos());
    //console.log(this.textarea);
  }

  _createKeys() {
    let fragment = document.createDocumentFragment();
    layout.forEach((row, index) => {
      const keysRow = document.createElement('div');
      keysRow.classList.add(`keyboard__row`, `row_${index + 1}`);
      row.forEach((key, i) => {
        const keyElement = document.createElement('button');
        const keyData = lang[`${this.lang}`].find((el) => el.code == key);
        keyElement.setAttribute('type', 'button');
        keyElement.classList.add('keyboard__key', `key_${keyData.code}`);
        keyElement.setAttribute('data-keycode', `${keyData.code}`);
        keyElement.innerHTML = keyData.small;

        switch (key) {
          case 'ShiftRight':
          case 'ShiftLeft':
            keyElement.addEventListener('mousedown', () => {
              this.numRow = !this.numRow;
              this.upperCase = !this.upperCase;
              this._switchCase();
              this._switchNum();
            });
            keyElement.addEventListener('mouseup', () => {
              this.numRow = !this.numRow;
              this.upperCase = !this.upperCase;
              this._switchCase();
              this._switchNum();
            });
            break;

          case 'CapsLock':
            keyElement.addEventListener('click', () => {
              this.upperCase = !this.upperCase;
              const caps = document.querySelector('.key_CapsLock');
              caps.classList.toggle('key_CapsLock--active');
              this._switchCase();
            });
            break;

          case 'Delete':
            keyElement.addEventListener('click', () => {
              this.right = this.right.slice(1);
              this._updateTextArea();
            });
            break;

          case 'Backspace':
            keyElement.addEventListener('click', () => {
              this.left = this.left.slice(0, -1);
              this._updateTextArea();
            });
            break;

          case 'Tab':
            keyElement.addEventListener('click', () => {
              this.left += '   ';
              this._updateTextArea();
            });
            break;

          case 'Enter':
            keyElement.addEventListener('click', () => {
              this.left += '\n';
              this._updateTextArea();
            });
            break;

          case 'ArrowLeft':
            keyElement.addEventListener('click', () => {
              if (this.left) {
                this.right =
                  this.left.charAt(this.left.length - 1) + this.right;
                this.left = this.left.slice(0, -1);
                this._updateTextArea();
              }
            });
            break;

          case 'ArrowRight':
            keyElement.addEventListener('click', () => {
              if (this.right) {
                this.left = this.left + this.right.charAt(0);
                this.right = this.right.slice(1);
                this._updateTextArea();
              }
            });
            break;

          case 'ArrowUp':
            keyElement.addEventListener('click', () => {
              if (this.left.length > 74) {
                this.right =
                  this.left.substr(
                    this.left.length - 75,
                    this.left.length - 1
                  ) + this.right;
                this.left = this.left.slice(0, -75);
                this._updateTextArea();
              }
            });
            break;

          case 'ArrowDown':
            keyElement.addEventListener('click', () => {
              if (this.right.length > 74) {
                this.left = this.left + this.right.slice(0, 75);
                this.right = this.right.slice(75);
                this._updateTextArea();
              }
            });
            break;

          case 'Space':
            keyElement.addEventListener('click', () => {
              this.left += ' ';
              this._updateTextArea();
            });
            break;

          default:
            if (keyElement.innerHTML.length < 2) {
              keyElement.addEventListener('click', () => {
                this.left += keyElement.textContent;
                this._updateTextArea();
              });
            }
            break;
        }

        keysRow.appendChild(keyElement);
      });

      fragment.appendChild(keysRow);
    });
    return fragment;
  }

  _cursorPos() {
    this.left = this.value.slice(0, this.textarea.selectionStart);
    this.right = this.value.slice(this.textarea.selectionStart);
  }

  _updateTextArea() {
    this.value = this.left + this.right;
    this.textarea.textContent = this.value;
    this.textarea.selectionStart = this.left.length;
    this.textarea.selectionEnd = this.left.length;
    this.textarea.focus();
    this._cursorPos();
  }

  _capsLock() {
    if (this.capsLock) {
      for (let key of this.keys) {
        if (key.innerHTML.length == 1) {
          key.innerHTML = key.innerHTML.toUpperCase();
        }
      }
    } else {
      for (let key of this.keys) {
        if (key.innerHTML.length == 1) {
          key.innerHTML = key.innerHTML.toLowerCase();
        }
      }
    }
  }
  /* Delete
  _switch() {
    for (let key of this.keys) {
      const keyData = lang[`${this.lang}`].find(
        (el) => el.code == key.dataset.keycode
      );
      key.innerHTML = this.shift ? keyData.shift : keyData.small;
    }
  }
  */

  _switchNum() {
    for (let key of this.keys) {
      const keyData = lang[`${this.lang}`].find(
        (el) => el.code == key.dataset.keycode
      );
      if (keyData.shift.toLowerCase() !== keyData.small)
        key.innerHTML = this.numRow ? keyData.shift : keyData.small;
    }
  }

  _switchCase() {
    for (let key of this.keys) {
      const keyData = lang[`${this.lang}`].find(
        (el) => el.code == key.dataset.keycode
      );
      if (keyData.shift.toLowerCase() == keyData.small)
        key.innerHTML = this.upperCase ? keyData.shift : keyData.small;
    }
    this.text.textContent = `Toggle language: Left Shift + Left Ctrl. Designed for Windows. Current language: ${this.lang}`;
  }

  _onKeyDown(event) {
    event.preventDefault();
    if (event.code == 'ShiftLeft' && event.ctrlKey) {
      this.lang = this.lang == 'en' ? 'ru' : 'en';
      localStorage.setItem('lang', this.lang);
    }
    if (event.key == 'Shift') {
      if (!this.shiftPressed) {
        this.numRow = !this.numRow;
        this.upperCase = !this.upperCase;
        this._switchCase();
        this._switchNum();
      }
      this.shiftPressed = true;
    }

    for (let key of this.keys) {
      if (key.dataset.keycode == event.code) {
        if (event.code == 'CapsLock') {
          if (!this.capsLockPressed) {
            key.click();
            key.classList.add('clicked');
            this.capsLockPressed = true;
          }
        } else {
          key.click();
          key.classList.add('clicked');
        }
      }
    }
  }

  _onKeyUp(event) {
    if (event.key == 'Shift') {
      this.numRow = !this.numRow;
      this.upperCase = !this.upperCase;
      this._switchCase();
      this._switchNum();
      this.shiftPressed = false;
    }
    if (event.code == 'CapsLock') {
      this.capsLockPressed = false;
    }
    for (let key of this.keys) {
      if (key.dataset.keycode == event.code) {
        key.classList.remove('clicked');
      }
    }
  }
}

const kb = new Keyboard();
window.addEventListener('DOMContentLoaded', function () {
  kb.init();
});
