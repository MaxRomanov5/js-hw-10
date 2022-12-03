import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;

const refs = {
  userCountry: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
function clearWrap(wrap) {
  wrap.innerHTML = '';
}
function onInput(e) {
  let inputValue = e.target.value.trim();
  if (!inputValue) {
    clearWrap(refs.countryList);
    clearWrap(refs.countryInfo);
    return;
  }
  fetchCountries(inputValue)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearWrap(refs.countryList);
        clearWrap(refs.countryInfo);
        return;
      }

      renderFetchCountries(data);
    })
    .catch(err => {
      clearWrap(refs.countryList);
      clearWrap(refs.countryInfo);
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderFetchCountries(countries) {
  if (countries.length === 1) {
    clearWrap(refs.countryList);
    refs.countryInfo.innerHTML = countryInfo(countries);
  } else {
    clearWrap(refs.countryInfo);
    refs.countryList.innerHTML = countriesList(countries);
  }
}

function countriesList(countries) {
  return countries
    .map(
      ({ name, flags }) =>
        `<li class="list__item"><img src="${flags.svg}" alt="${name.official}" width=60 height=50> ${name.official}</li>`
    )
    .join('');
}

function countryInfo(country) {
  return country.map(({ name, capital, population, flags, languages }) => {
    return `
        <h1 class="name"><img src="${flags.svg}" alt="${
      name.official
    }" width=40 height=30> ${name.official}</h1>
        <p class="descr">Capital: ${capital[0]}</p>
        <p class="descr">Population: ${population}</p>
        <p class="descr">Languages: ${Object.values(languages).join(',')}</p>
      `;
  });
}

refs.userCountry.addEventListener('input',debounce(onInput, DEBOUNCE_DELAY));
