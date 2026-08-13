import { useState } from 'react'


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

const Persons = ({ numbersToShow }) => {
  return (
    <div>
      {numbersToShow()}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilterValue] = useState('')

  const nameExists = (name) => persons.some(person => person.name === name)

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    if (nameExists(newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    setPersons(persons.concat(nameObject))
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
      toShow = toShow.filter(person => person.name.toLocaleLowerCase().includes(filterValue))
    }
    return toShow.map(person => <div key={person.id}>{person.name} {person.number}</div>)
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

      <Persons numbersToShow={numbersToShow} />

    </div>
  )
}

export default App
