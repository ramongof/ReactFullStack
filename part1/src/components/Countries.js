import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ConfigApi from './ConfigAPI'

const ManyCountries = (props) => {       
    return(
        (props.filterCountries.length > 6) 
            ? <div>Too many matches, specify another filter</div> 
            : <ShowCountries filterCountries={props.filterCountries} handleOnclick={props.handleOnclick} setCountrieName={props.setCountrieName} />                
    )
}

const ShowCountries = (props) => {       
    let row = () => props.filterCountries.slice(0, 6).map(countrie =>
        <div key={countrie.numericCode}>
            {countrie.name} 
            <input type="button" value="Show" onClick={() => props.handleOnclick(countrie.numericCode)} />
        </div>
    )   
    return(
        (props.filterCountries.length > 1)
            ? row()
            : <ShowCountrie filteredCountry={props.filterCountries} setCountrieName={props.setCountrieName} />            
    )
}
 
const ShowCountrie = (props) => {
    console.log('Else row')          
    props.setCountrieName(...props.filteredCountry.map(e => e.name))    
    let row = () => props.filteredCountry.map(e =>
        <div key={e.numericCode}>                                        
            <div id="countrieName" className="countries-name">{e.name}</div>
            <div className="countries-details"><b>Capital:</b> {e.capital}</div>
            <div className="countries-details"><b>Population:</b> {e.population}</div>
            <br/>
            <div><b>Languages</b></div>
            <div>
                <ul>
                    {e.languages.map(element => <li key={element.iso639_1}>{element.name}</li>)}
                </ul>
            </div>
            <div>
                <table> 
                    <tbody className="countries-details">
                        <tr> 
                            <th rowSpan="3"><img alt="#" src={e.flag} height="100" width="150"></img></th> 
                            <th><b>Region:</b></th>     
                            <td>{e.region}</td>                                                                                                                                                        
                        </tr>
                        <tr>
                            <th><b>Currency:</b></th>  
                            <td>{e.currencies.map(element => element.name)}</td>                                
                        </tr>
                        <tr>
                            <th><b>Area:</b></th> 
                            <td>{e.area}&#x33A1;</td>
                        </tr>
                    </tbody>                                                       
                </table>                            
            </div>                                                  
        </div>                  
    )        
    return row()    
}


const Weather = ({weather}) => {                 
    const weatherCurrent = { ...weather.current}
    const weatherLocation = { ...weather.location}            
    return(        
        <div>             
            <table>     
                <thead>
                    <tr>
                        <th><b>Weather in </b></th>
                        <td><b>{weatherLocation.name}</b></td>
                    </tr>      
                </thead>                    
                 <tbody className="countries-details">
                    <tr> 
                        <th rowSpan="2"><img className="weather-image" alt="#" src={weatherCurrent.weather_icons} height="64" width="64"></img></th>                       
                        <th><b>Temperature: </b>{weatherCurrent.temperature} celsius</th>                                                                                                                                                                     
                    </tr>
                    <tr>
                        <th><b>Wind</b> {weatherCurrent.wind_speed} Kph direction {weatherCurrent.wind_dir}</th>                                           
                    </tr>
                 </tbody>                
            </table>   
        </div>
    )
}

const Countries = (props) => {        
    const searchCountries = props.searchCountries.trim()    
    const countrieName = props.countrieName    
    const [ weather, setWeather ] = useState([])

    const filterCountries = (nameCountrie) => props.countries.filter(element => element ? (element['name'].toLowerCase().indexOf(nameCountrie.toLowerCase()) !== -1) : null)    
    const filteredCountry = (code) => props.countries.filter(e => e ? (e.numericCode === code) : null)         

    const handleOnclick = (code) => {                                             
        props.setSearchCodes(code)                                                     
    }                  

    useEffect(() => {
        if(countrieName)
        {            
            axios
                .get(`http://api.weatherstack.com/current?access_key=`+ConfigApi+`&query=`+countrieName)
                .then(response => {
                    console.log('Promise Fulfilled')                             
                    setWeather(response.data)
                })   
                console.log('test')
        }
        
    }, [countrieName])    
        
    return(       
        <div>
            {(searchCountries !== '' && !props.searchCodes) 
                ? <ManyCountries filterCountries={filterCountries(searchCountries)} handleOnclick={handleOnclick} setCountrieName={props.setCountrieName} /> 
                : null}
            {props.searchCodes && <ShowCountrie filteredCountry={filteredCountry(props.searchCodes)} setCountrieName={props.setCountrieName} />}
            <br/>
            {props.countrieName && <Weather weather={weather} />}                          
        </div>          
    )
}
export default Countries
