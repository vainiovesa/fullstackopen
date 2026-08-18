import { useState, useEffect } from 'react'
import countryService from './services/countries'



const CountryFilter = ({ filterValue, handleFilterChange }) => {
  return (
    <div>
      find countries <input value={filterValue} onChange={handleFilterChange} />
    </div>
  )
}


const CountryLi = ({ name }) => <li>{name}</li>

const CountryDisplay = ({ countries }) => {
  if (countries.length === 0) {
    return null
  }
  if (countries.length === 1) {
    const country = countries[0]
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
  const toShow = countries.map(country => <CountryLi key={country.name.common} name={country.name.common} />)
  return (
    <ul>
      {toShow}
    </ul>
  )
}


function App() {
  const [filterValue, setFilterValue] = useState('')
  const [countriesToSHow, setCountriesToShow] = useState([])

  useEffect(() => {
    if (filterValue !== '') {
      countryService.getAll()
        .then(response => {
          const filteredCountries = response.filter(
            country => country.name.common.toLowerCase().includes(filterValue)
          )
          setCountriesToShow(filteredCountries)
        })
    }
  }, [filterValue])

  const handleFilterChange = event => {
    setFilterValue(event.target.value)
  }


  return (
    <>
      <CountryFilter filterValue={filterValue} handleFilterChange={handleFilterChange} />

      <CountryDisplay countries={countriesToSHow} />
    </>
  )
}

export default App
