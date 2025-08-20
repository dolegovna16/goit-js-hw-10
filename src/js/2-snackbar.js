import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const formElement = document.querySelector('form.form');
 
formElement.addEventListener('submit', e => {
  e.preventDefault();

 const selection = formElement.elements.state.value;
  
  const delay = Number.parseInt(formElement.elements.delay.value);
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (selection === 'fulfilled') {
        resolve(delay);
      } else if(selection === 'rejected') {
        reject(delay);
      }
    }, delay);
  })
    .then(value => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${value} ms`,
        position: 'topRight',
        icon: 'none',
      });
    })
    .catch(err => {
      iziToast.error({
        message: `❌ Rejected promise in ${err} ms`,
        position: 'topRight',
        icon: 'none',
      });
    });
  return promise;
});