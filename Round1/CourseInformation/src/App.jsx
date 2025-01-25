const Header = (props) => {
  console.log(props)
  return (
    <div>
      <p>
        {props.course.name}
      </p>
    </div>
  )
}

const Content = (props) => {
  console.log(props)
  return (<div>{props.course.parts.map(part => <p>{part.name} {part.exercises}</p>)}</div>)
}

const Total = (props) => {
  console.log(props.course.parts[0])
  let sum = 0;
  props.course.parts.forEach(part => sum += part.exercises)
  return (
    <div>
      <p>Number of exercises {sum}</p>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default App