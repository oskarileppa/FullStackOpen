const Persons = (props) => {
    return (
        <>
            <h2>Numbers</h2>
            <ul>
                {props.persons.map(person => (
                    <li key={person.id}>
                        {person.name} {person.number}
                        <button onClick={() => props.deletePerson(person.id)}>delete</button>
                    </li>
                ))}
</ul>
        </>
    )
        
}

export default Persons