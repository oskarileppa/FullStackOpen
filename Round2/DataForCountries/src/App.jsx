import { useState, useEffect } from 'react'
import axios from 'axios'
import countryService from './services/countries'
import Countries from './components/Countries'
import Country from './components/Country'
import Find from './components/Find'

const App = () => {
  const [countries, setCountries] = useState([])
  const [showCountry, setShowCountry] = useState([])
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)


  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
    setShowCountry([])

    if(countriesToShow.length === 1) {
      countryService
        .getCountry(countriesToShow[0].name.common)
        .then(country => {
          console.log(country)
        })
    }
  }

  const handleShowCountry = (country) => {

    console.log("country:", country)
    console.log("countries:", countries)

    const selectedCountry = countries.find(c => c.name.common === country.name.common)
    setShowCountry([selectedCountry])
    console.log("selectedCountry:", selectedCountry)
  
    countryService
      .getCountry(selectedCountry.name.common)
        .then(country => {
          console.log(country)
    })
  }


  const countriesToShow = filter === '' ? countries : countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
  console.log("countries to show:", countriesToShow)

  return (
    <div>
      <Find filter={filter} handleFilterChange={handleFilterChange} />
      <Countries countries={countriesToShow} handleShowCountry={handleShowCountry} />
      <Country showCountry={showCountry} countries={countriesToShow} handleShowCountry={handleShowCountry} />
    </div>
  )
}

export default App