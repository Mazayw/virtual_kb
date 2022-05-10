import './styles/index.sass';
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
    this.keys = '';
  }

  init() {
    if (localStorage.getItem('lang')) {
      this.lang = localStorage.getItem('lang');
    }
    this.main.classList.add('keyboard');
    this.main.appendChild(this.createKeys());
    this.textarea.setAttribute('placeholder', 'Start typing...');
    this.textarea.setAttribute('spellcheck', 'false');
    this.textarea.setAttribute('wrap', 'hard');
    this.text = document.createElement('p');
    this.text.textContent = `Toggle language: Left Shift + Left Ctrl. Designed for Windows. Current language: ${this.lang.toUpperCase()}`;

    document.body.prepend(this.text);
    document.body.prepend(this.main);
    document.body.prepend(this.textarea);
    this.createKeys();
    this.keys = document.getElementsByClassName('keyboard__key');

    document.addEventListener('keydown', (event) => this.onKeyDown(event));
    document.addEventListener('keyup', (event) => this.onKeyUp(event));
    this.textarea.addEventListener('click', () => this.cursorPos());
  }

  createKeys() {
    const fragment = document.createDocumentFragment();
    layout.forEach((row, index) => {
      const keysRow = document.createElement('div');
      keysRow.classList.add(`keyboard__row`, `row_${index + 1}`);
      row.forEach((key) => {
        const keyElement = document.createElement('button');
        const keyData = lang[`${this.lang}`].find((el) => el.code === key);
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
              this.switchCase();
              this.switchNum();
            });
            keyElement.addEventListener('mouseup', () => {
              this.numRow = !this.numRow;
              this.upperCase = !this.upperCase;
              this.switchCase();
              this.switchNum();
            });
            break;

          case 'CapsLock':
            keyElement.addEventListener('click', () => {
              this.upperCase = !this.upperCase;
              const caps = document.querySelector('.key_CapsLock');
              caps.classList.toggle('key_CapsLock--active');
              this.switchCase();
            });
            break;

          case 'Delete':
            keyElement.addEventListener('click', () => {
              this.right = this.right.slice(1);
              this.updateTextArea();
            });
            break;

          case 'Backspace':
            keyElement.addEventListener('click', () => {
              this.left = this.left.slice(0, -1);
              this.updateTextArea();
            });
            break;

          case 'Tab':
            keyElement.addEventListener('click', () => {
              this.left += '\t';
              this.updateTextArea();
            });
            break;

          case 'Enter':
            keyElement.addEventListener('click', () => {
              this.left += '\n';
              this.updateTextArea();
            });
            break;

          case 'Space':
            keyElement.addEventListener('click', () => {
              this.left += ' ';
              this.updateTextArea();
            });
            break;

          default:
            if (keyElement.innerHTML.length < 2) {
              keyElement.addEventListener('click', () => {
                this.left += keyElement.textContent;
                this.updateTextArea();
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

  cursorPos() {
    this.left = this.value.slice(0, this.textarea.selectionStart);
    this.right = this.value.slice(this.textarea.selectionStart);
  }

  updateTextArea() {
    this.value = this.left + this.right;
    this.textarea.value = this.value;
    this.textarea.selectionStart = this.left.length;
    this.textarea.selectionEnd = this.left.length;
    this.textarea.focus();
    this.cursorPos();
  }

  switchNum() {
    Array.from(this.keys).forEach((key, index) => {
      const keyData = lang[`${this.lang}`].find(
        (el) => el.code === key.dataset.keycode
      );
      if (keyData.shift.toLowerCase() !== keyData.small)
        this.keys[index].innerHTML = this.numRow
          ? keyData.shift
          : keyData.small;
    });
  }

  switchCase() {
    Array.from(this.keys).forEach((key, index) => {
      const keyData = lang[`${this.lang}`].find(
        (el) => el.code === key.dataset.keycode
      );
      if (keyData.shift.toLowerCase() === keyData.small)
        this.keys[index].innerHTML = this.upperCase
          ? keyData.shift
          : keyData.small;
    });
    this.text.textContent = `Toggle language: Left Shift + Left Ctrl. Designed for Windows. Current language: ${this.lang.toUpperCase()}`;
  }

  onKeyDown(event) {
    if (!event.code.match(/F\d\d?/g)) event.preventDefault();
    if (event.code === 'ShiftLeft' && event.ctrlKey) {
      this.lang = this.lang === 'en' ? 'ru' : 'en';
      localStorage.setItem('lang', this.lang);
    }
    if (event.key === 'Shift') {
      if (!this.shiftPressed) {
        this.numRow = !this.numRow;
        this.upperCase = !this.upperCase;
        this.switchCase();
        this.switchNum();
      }
      this.shiftPressed = true;
    }

    Array.from(this.keys).forEach((key) => {
      if (key.dataset.keycode === event.code) {
        if (event.code === 'CapsLock') {
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
    });
  }

  onKeyUp(event) {
    if (event.key === 'Shift') {
      this.numRow = !this.numRow;
      this.upperCase = !this.upperCase;
      this.switchCase();
      this.switchNum();
      this.shiftPressed = false;
    }
    if (event.code === 'CapsLock') {
      this.capsLockPressed = false;
    }
    Array.from(this.keys).forEach((key) => {
      if (key.dataset.keycode === event.code) {
        key.classList.remove('clicked');
      }
    });
  }
}

const kb = new Keyboard();
window.addEventListener('DOMContentLoaded', () => {
  kb.init();
});
