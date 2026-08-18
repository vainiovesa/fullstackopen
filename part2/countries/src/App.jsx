import { useState, useEffect } from 'react'
import countryService from './services/countries'



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

const CountryDisplay = ({ countries, show }) => {
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

  useEffect(() => {
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

      <CountryDisplay countries={countriesToSHow} show={show} />
    </>
  )
}

export default App
