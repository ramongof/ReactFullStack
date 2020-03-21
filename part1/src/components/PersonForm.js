import React, { useState } from 'react'

const PersonForm = (props) => {
    const setPersons = props.setPersons    
    let checkElement = (e) => props.persons.map(person => person[e])     
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')

    const nameTrim = newName.trim()
    const numberTrim = newNumber.trim()

    const handleNameChange = (event) => {
        // console.log(event.target.value)
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        // console.log(event.target.value)
        setNewNumber(event.target.value)
    }

    const addPersons = (event) => {
        event.preventDefault()        
        const nameObject = {
            name: nameTrim,
            number: numberTrim,
        }
        
        if((!checkElement('name').includes(nameTrim.trim()) && nameTrim)&&(!checkElement('number').includes(numberTrim) && numberTrim)){
            props.personService
                .create(nameObject)
                .then(returnedPerson => {
                    setPersons(props.persons.concat(returnedPerson))  
                    props.setNotificationMessage(`Added ${nameTrim}`)
                    setTimeout(() => {
                        props.setNotificationMessage(null)
                    }, 5000)                  
                })            
        }
        else if(!nameTrim || (checkElement('name').includes(nameTrim))){     
            if(!numberTrim || checkElement('number').includes(numberTrim)){                 
                let message = (checkElement('name').includes(nameTrim)) ? `${nameTrim} is already added to phonebook` : 'Insert a new name!'                
                window.alert(`${message}`)  
            }
            else{
                if(window.confirm(`${nameTrim} is already added to Phonebook, replace the old number with the new one?`)){
                    props.personService
                        .update( props.persons.filter(e => (e.name === nameTrim)).map(e => e.id), nameObject)
                        .then(returnedPersons => {                            
                            setPersons(props.persons.filter(e => e.id !== returnedPersons.id).concat(returnedPersons))
                            props.setNotificationMessage(`${returnedPersons.name} number was replaced`)
                            props.setClassType('notification update')
                            setTimeout(() => {
                                props.setNotificationMessage(null)
                                props.setClassType('notification')
                            }, 5000)     
                        })
                        .catch(error => {
                            props.setNotificationMessage(
                                `${nameTrim} was already deleted from Phonebook`
                            )
                            props.setClassType('notification error')
                            setTimeout(() => {
                                props.setNotificationMessage(null)
                                props.setClassType('notification')
                            }, 5000)
                        })                                                  
                }
            }                                    
        }        
        else if(!numberTrim || checkElement('number').includes(numberTrim)){            
            let message = (checkElement('number').includes(numberTrim)) ? `${numberTrim} is already added to phonebook` : 'Insert a new Number!'    
            window.alert(`${message}`)  
        }           
        setNewName('')
        setNewNumber('') 
    }

    return(
        <div>
            <form onSubmit={addPersons}>
                <div>
                    name: <input
                            value={newName}
                            onChange={handleNameChange}
                            />
                </div>
                <br/>
                <div>
                    number: <input
                                value={newNumber}
                                onChange={handleNumberChange}
                            />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </div>
    )
}

export default PersonForm