import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dayEl = document.querySelector('[data-days]');
const hourEl = document.querySelector('[data-hours]');
const minuteEl = document.querySelector('[data-minutes]');
const secondEl = document.querySelector('[data-seconds]');
const myInput = document.querySelector('#datetime-picker');
const btn = document.querySelector('[data-start]');

btn.disabled = true;
let userSelectedDate = null;
let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= Date.now()) {
      iziToast.error({
        title: 'Please choose a date in the future',
        position: 'topRight',
      });
      btn.disabled = true;
      btn.classList.remove('button-active');
    } else {
      userSelectedDate = selectedDates[0];
      btn.disabled = false;
      btn.classList.add('button-active');
    }
  },
};

flatpickr(myInput, options);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor(((ms % day) % hour) / minute),
    seconds: Math.floor((((ms % day) % hour) % minute) / second),
  };
}

function updateTimer(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);
  dayEl.textContent = addLeadingZero(days);
  hourEl.textContent = addLeadingZero(hours);
  minuteEl.textContent = addLeadingZero(minutes);
  secondEl.textContent = addLeadingZero(seconds);
}

btn.addEventListener('click', () => {
  myInput.disabled = true;
  btn.disabled = true;
  btn.classList.remove('button-active');

  intervalId = setInterval(() => {
    const timeLeft = userSelectedDate - Date.now();

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      iziToast.success({
        title: 'Your timer has run out.',
        position: 'topCenter',
      });
      myInput.disabled = false;
      btn.disabled = false;
      btn.classList.add('button-active');
      return;
    }

    updateTimer(timeLeft);
  }, 1000);
});
