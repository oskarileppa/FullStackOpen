const Submit = (props) => {

    return (
        <div>
            <h2>Add a new</h2>
            <form onSubmit={props.onSubmit}>
                Name: 
                <input
                value={props.newName}
                onChange={props.handleNameChange}
                />
                <br />
                Number: 
                <input 
                value={props.newNumber}
                onChange={props.handleNumberChange}
                />
                <button type="submit">save</button>
            </form> 
        </div>
       
    )
}

export default Submit