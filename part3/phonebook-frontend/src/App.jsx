import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [notification, setNotification] = useState({message: null})

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
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personObject = persons.find(p => p.name === newName)
        const newPersonObject = {...personObject, number: newNumber}

        personService.update(newPersonObject)
          .then(response => {
            const newPersons = persons.map(person => {
              return person.id === response.id ? response : person
            })
            setPersons(newPersons)
            setNotification({message: `Changed the number of ${response.name} to ${response.number}`})
            setTimeout(() => {
              setNotification({message: null})
            }, 5000)
          })
          .catch(error => {
            setNotification({
              message: `Information of ${newName} has already been removed from server`,
              type: 'error'
            })
            setTimeout(() => {
              setNotification({message: null})
            }, 5000)
            setPersons(persons.filter(p => p.name !== newName))
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }

    personService.create(personObject)
      .then(response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
        setNotification({message: `Added ${response.name}`})
        setTimeout(() => {
          setNotification({message: null})
        }, 5000)
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

      <Notification message={notification.message} type={notification.type} />

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
