import React from 'react'

const Persons= (props) => {
    const setPersons = props.setPersons       
    const handleDelete = (person) => {                        
        if(window.confirm(`are you sure you want to delete ${person.name}`)){
            props.personService
                .deletePerson(person.id)     
                .then(() => {                    
                    setPersons(props.persons.filter(e => e.id !== person.id))                     
                    props.setNotificationMessage(`${person.name} was successefully deleted`)
                    props.setClassType('notification delete')
                    setTimeout(() => {
                        props.setNotificationMessage(null)
                        props.setClassType('notification')
                    }, 5000) 
                })                                     
        }                   
    }

    let row = () => props.persons.map(person => <li key={person.name} >{person.name} {person.number} <button type="button" onClick={() => handleDelete(person)}>delete</button> </li>)
    
    if(props.searchName.trim() !== '')
    {
        let filterNames = () => props.persons.filter(element => { 
                if(element['name'].toLowerCase().indexOf(props.searchName.toLowerCase()) !== -1)
                {      
                    return element
                }
            }
        )  
        row = () => filterNames().map(e =>  <li key={e.name} >{e.name} {e.number} </li>)
    }

    return(
        <div>
            <ul>
                {row()}
            </ul>
        </div>
    )
}
export default Persons
