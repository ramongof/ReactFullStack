import React, { useState, useEffect } from 'react'
import Search from './components/SearchPersons'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notifications'
import './indexPerson.css'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ notificationMessage, setNotificationMessage ] = useState(null)
  const [ classType, setClassType ] = useState('notification')

  useEffect(() => {
    personService
        .getAll()
        .then(initialPersons => {
            setPersons(initialPersons)
        })
}, [])
  
  const [ searchName, setSearchName ] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} classType={classType}/>      
      <Search name={searchName} onChange={setSearchName} persons={persons}/>
      <br/>
      <PersonForm persons={persons} setPersons={setPersons} personService={personService} setNotificationMessage={setNotificationMessage} setClassType={setClassType} />
      <h2>Numbers</h2>
      <Persons persons={persons} searchName={searchName} setPersons={setPersons} personService={personService} setNotificationMessage={setNotificationMessage} setClassType={setClassType} />      
    </div>
  )
}


export default App