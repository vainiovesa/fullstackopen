import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'


const CountryFilter = ({ filterValue, handleFilterChange }) => {
  return (
    <div>
      find countries <input value={filterValue} onChange={handleFilterChange} />
    </div>
  )
}


const CountryLi = ({ name, show }) => {
  return (
    <li>{name} <button onClick={() => show(name)}>Show</button> </li>
  )
}

const CountryDisplay = ({ countries, show, weather }) => {
  if (countries.length === 0) {
    return null
  }
  if (countries.length === 1) {
    const country = countries[0]

    let weatherInfo = null
    if (weather) {
      weatherInfo = (
        <div>
          <h2>Weather in {country.capital}</h2>
          Temperature {weather.main.temp} Celsius <br />
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={`Icon for ${weather.weather[0].main}`}
          /> <br />
          Wind {weather.wind.speed} m/s
        </div>
      )
    }
    return (
      <div>
        <h1>{country.name.common}</h1>
        Capital {country.capital} <br />
        Area {country.area}

        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
        </ul>

        <img style={{border: '1px solid black'}} src={country.flags.png} alt={country.flags.alt} />

        {weatherInfo}
      </div>
    )
  }
  if (countries.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
  const toShow = countries.map(country => {
    return <CountryLi key={country.name.common} show={show} name={country.name.common} />}
  )
  return (
    <ul>
      {toShow}
    </ul>
  )
}


function App() {
  const [filterValue, setFilterValue] = useState('')
  const [countriesToSHow, setCountriesToShow] = useState([])
  const [selected, setSelected] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    setWeather(null)

    if (filterValue !== '') {
      countryService.getAll()
        .then(response => {
          let filteredCountries = []

          if (selected) {
            filteredCountries = response.filter(country => country.name.common === selected)
          } else {
            filteredCountries = response.filter(
              country => country.name.common.toLowerCase().includes(filterValue)
            )
          }

          if (filteredCountries.length === 1) {
            weatherService.getForCity(filteredCountries[0].capital)
              .then(data => setWeather(data))
          }

          setCountriesToShow(filteredCountries)
        })
    } else {
      setCountriesToShow([])
    }
  }, [filterValue, selected])

  const handleFilterChange = event => {
    setFilterValue(event.target.value)
    setSelected(null)
  }

  const show = name => {
    setSelected(name)
  }

  return (
    <>
      <CountryFilter filterValue={filterValue} handleFilterChange={handleFilterChange} />

      <CountryDisplay countries={countriesToSHow} show={show} weather={weather} />
    </>
  )
}

export default App
