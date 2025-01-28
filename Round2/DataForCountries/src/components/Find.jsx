const Find = (props) => {
    return (
    <form>
        Find countries: 
        <input
          value={props.filter}
          onChange={props.handleFilterChange}
        />
    </form>
    )
}

export default Find