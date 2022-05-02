import ru from './ru.js';
import en from './en.js';

export default { ru, en };

let body = document.querySelector('body');

document.addEventListener('keydown', (event) => {
  const keyName = event.code;
  console.log(keyName);
  body.append(keyName);
  body.append('<br>');
});
