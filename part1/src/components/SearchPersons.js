import React from 'react'


const SearchPersons = (props) => {
    const setSearchName = props.onChange    
    let name = props.name
    
    const handleNameChange = (event) => {
      // console.log(event.target.value)
      setSearchName(event.target.value)
    }  
    return(
      <div>
        Who are you looking for? <input value={name} onChange={handleNameChange} />      
      </div>
    )    
}

export default SearchPersons