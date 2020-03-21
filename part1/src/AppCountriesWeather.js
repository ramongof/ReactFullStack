import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Search from './components/Search'
import Countries from './components/Countries'


const App = () => {
  const [ countries, setCountries ] = useState([])
  const [ searchCountries, setSearchCountries ] = useState('')  
  const [ searchCodes, setSearchCodes ] = useState('')
  const [ countrieName, setCountrieName ] = useState('')

  const hook = () => {
    console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }
  useEffect(hook, [])

  return (
    <div className="App-header">
      <h2>Discover details around the world</h2>
      <Search
        name={searchCountries} onChange={setSearchCountries} 
        setSearchCodes={setSearchCodes} setCountrieName={setCountrieName} 
      />
      <br/>            
      <Countries 
        countries={countries} searchCountries={searchCountries} 
        setSearchCodes={setSearchCodes} searchCodes={searchCodes} 
        countrieName={countrieName}  setCountrieName={setCountrieName} 
      />      
    </div>
  )
}
export default App