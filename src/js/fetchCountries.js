const URL = 'https://restcountries.com/v3.1/name';

export default function fetchCountries(name){
return fetch(`${URL}/${name}?fields=name,capital,population,flags,languages`).then((res) => {
    if (res.status === 404) {console.log(404);
        return Promice.reject(new Error());
      }
    return res.json();
})
}