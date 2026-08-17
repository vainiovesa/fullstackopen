import { useState, useEffect } from 'react'
import personService from './services/persons'


const Filter = ({ filterValue, handleFilterChange }) => {
  return (
    <div>
      filter shown with: <input value={filterValue} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const Person = ({ name, number, remove}) => {
  return (
    <div>
      {name} {number}
      <button onClick={remove}>remove</button>
    </div>
  )
}

const Persons = ({ numbersToShow, remove }) => {
  const toShow = numbersToShow.map(p => 
    <Person key={p.id} name={p.name} number={p.number} remove={() => remove(p.id)}/>
  )
  return (
    <div>
      {toShow}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilterValue] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
    }, [])

  const nameExists = (name) => persons.some(person => person.name === name)

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (nameExists(newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    personService.create(personObject)
      .then(response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
      })
  }

  const removePerson = (id) => {
    const person = persons.find(p => p.id === id)

    if (confirm(`Remove ${person.name}?`)) {
      personService.remove(id)
        .then(response => setPersons(persons.filter(p => p.id !== response.id)))
        .catch(error => {
          alert(`Person ${person.name} was already deleted from the server`)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
  }

  const numbersToShow = () => {
    let toShow = [...persons]
    if (filterValue !== '') {
      toShow = toShow.filter(person => person.name.toLowerCase().includes(filterValue))
    }
    return toShow
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filterValue={filterValue} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons numbersToShow={numbersToShow()} remove={removePerson} />

    </div>
  )
}

export default App
