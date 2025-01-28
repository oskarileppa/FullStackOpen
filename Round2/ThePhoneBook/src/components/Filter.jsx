const Filter = (props) => {
    return (
    <form>
        Filter shown with:
        <input
          value={props.filter}
          onChange={props.handleFilterChange}
        />
    </form>
    )
}

export default Filter