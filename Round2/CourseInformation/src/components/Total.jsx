const Total = ({ parts }) => {
    return (
        <>
            <p>Total of {parts.reduce((sum, part) => sum + part.exercises, 0)} excercises</p>
        </>
    )
}


export default Total