import { useState, useEffect } from 'react'
import numbersService from './services/numbers'
import Persons from './components/Persons'
import Filter from './components/Filter'
import Submit from './components/Submit'
import Header from './components/Header'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)


  useEffect(() => {
    numbersService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }

    console.log("personObject:", personObject)

    if(persons.some(person => person.name === newName && person.number === newNumber)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    if(persons.some(person => person.name === newName && person.number !== newNumber)) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newName)
        const changedPerson = { ...person, number: newNumber }

        numbersService
          .updateNumber(person.id, changedPerson)
          .then(returnedPerson => {
            console.log("returnedPerson:", returnedPerson)
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotificationMessage(
              `Updated the number of ${newName}`
            )
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          }) 
          .catch(error => {
            console.log(error.response.data.error)
            setErrorMessage(
              error.response.data.error
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
      return
    }
    
    numbersService
      .createNumber(personObject)
      .then(returnedPerson => {
        console.log("returnedPerson:", returnedPerson)
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setNotificationMessage(
          `Added ${newName}`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error.response.data.error)
        setErrorMessage(
          error.response.data.error
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const deletePerson = (id) => {
    console.log("Persons", persons)

    const person = persons.find(person => person.id === id)
  
    if(window.confirm(`Do you really want to delete ${person.name}?`)) {
      console.log("To be deleted id:", id)
      numbersService
        .deleteNumber(id)
          .then(status => {
          console.log("status:", status)
          console.log("deletedNumber:", person)
          setPersons(persons.filter(p => p.id !== person.id))
          setNotificationMessage(`Deleted ${person.name}`)
          setTimeout(() => {
          setNotificationMessage(null)
          }, 5000)
        }).catch(error => {
          console.log("error:", error)
          setErrorMessage(
            `Information of ${person.name} has already been removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    } 
  }

  const personsToShow = filter === '' ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <Header text='Phonebook' />
      <Notification error={errorMessage} notification={notificationMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Submit onSubmit={onSubmit} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App