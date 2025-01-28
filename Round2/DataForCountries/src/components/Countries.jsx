const Countries = (props) => {
    console.log(props)

    if(props.countries.length > 10) {
        return <p>Too many matches, specify another filter</p>
    }

    if(props.countries.length > 1) {

        return (
            <>
                <ul>
                    {props.countries.map(country => (
                        <li key={country.name.common}>
                            {country.name.common}
                            <button onClick={() => props.handleShowCountry(country)}>Show</button>
                        </li>
                    ))}
                </ul>
            </>
        )
    }
}

export default Countries