const Country = (props) => {
    console.log("country page props", props)
    console.log("showCountry length", props.showCountry.length)

    if(props.showCountry.length === 1 || props.countries.length === 1) {
        const country = props.showCountry.length === 1 ? props.showCountry[0] : props.countries.find(c => c.name.common === props.countries[0].name.common)
        console.log(country)
        return (
            <div>
                <h1>{country.name.common}</h1>
                <p>Capital: {country.capital}</p>
                <p>Population: {country.population}</p>
                <h2>Languages</h2>
                <ul>
                    {Object.entries(country.languages).map(([key, value]) => (
                        <li key={key}>{value}</li>
                    ))}
                </ul>
                <img src={country.flags.png} alt='flag' />
            </div>
        )
    }
}

export default Country