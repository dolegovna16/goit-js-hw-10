import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const closeSVGLink = new URL('../img/x-octagon.svg', import.meta.url).href;

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
// console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
// console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

const refs = {
  dateTimePicker: document.querySelector('input#datetime-picker'),
  dataStart: document.querySelector('button[data-start]'),
  dataPoints: document.querySelectorAll('div.timer span.value'),
  result: 0,
  copy: 0,
  intervalId: null,
  timeoutId: null,
};

let userSelectedDate;

refs.dataStart.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  locale: {
    firstDayOfWeek: 1,
  },
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      iziToast.error({
        backgroundColor: '#ef4040',
        class: 'error-message',
        title: 'Error',
        titleColor: '#fff',
        titleSize: '16px',
        titleLineHeight: 1.5,
        message: 'Please choose a date in the future',
        messageColor: '#fff',
        messageSize: '16px',
        messageLineHeight: 1.5,
        position: 'topRight',
        iconUrl: closeSVGLink,
      });
      refs.dataStart.disabled = true;
    } else if (selectedDates[0] > new Date()) {
      refs.dataStart.disabled = false;
      userSelectedDate = new Date(selectedDates[0]);
    }
  },
};

const calendar = flatpickr(refs.dateTimePicker, options);

const addLeadingZero = value => String(value).padStart(2, '0');

const timeCount = () => {
  const today = new Date();
  let msResult = userSelectedDate.getTime() - today.getTime();
  const result = convertMs(msResult);
  Array.from(refs.dataPoints).forEach(
    dataPoint =>
      (dataPoint.textContent = addLeadingZero(
        result[dataPoint.nextElementSibling.textContent.toLowerCase()]
      ))
  );
};

refs.dataStart.addEventListener('click', () => {
  refs.dataStart.disabled = true;
  refs.dateTimePicker.disabled = true;
  timeCount();
  const today = new Date();
  const todayMs = today.getTime();
  const end = userSelectedDate.getTime();
  let i = Math.floor((end - todayMs) / 1000);
  refs.intervalId = setInterval(function () {
    i--;
    if (i > 0) {
      timeCount();
    } else {
      Array.from(refs.dataPoints).forEach(datapoint => {
        datapoint.textContent = "00"
        })
        clearInterval(refs.intervalId);
        refs.dateTimePicker.disabled = false;
    }
  }, 1000);
});