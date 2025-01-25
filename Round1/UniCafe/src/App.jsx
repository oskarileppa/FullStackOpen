import { useState } from 'react'

const Titles = props => <div><h1>{props.value}</h1></div>

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const StatisticLine = (props) => (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
)

const Statistics = (props) => {
  const all = props.values[0].newValue + props.values[1].newValue + props.values[2].newValue;
  const average = all !== 0 ? (props.values[0].newValue - props.values[2].newValue) / all : 0;
  const positive = all !== 0 ? (props.values[0].newValue / all) * 100 : 0;

  const statistics = {
    good: props.values[0].newValue,
    neutral: props.values[1].newValue,
    bad: props.values[2].newValue,
    all: all,
    average: average,
    positive: positive,
  };

  console.log(props);

  return (
    <div>
      {all === 0 ? 
        <p>No feedback given</p> : (
        <table>
          <tbody>
            <StatisticLine text="Good" value={statistics.good}/>
            <StatisticLine text="Neutral" value={statistics.neutral}/>
            <StatisticLine text="Bad" value={statistics.bad}/>
            <StatisticLine text="All" value={statistics.all}/>
            <StatisticLine text="Average" value={statistics.average}/>
            <StatisticLine text="Positive" value={statistics.positive}/>
          </tbody>
        </table>
      )}
    </div>
  );
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const values = [
    {
    name: "good",
    newValue: good,
  },
  {
    name: "neutral",
    newValue: neutral,
  },
  {
    name: "bad",
    newValue: bad,
  },
  ]

console.log('values', values)

  const setToValue = (newValue) => {

    console.log('newValue', newValue)

    const newValues = values.map(item => {
      if (item.name === newValue) {
        if (newValue === 'good') {
          return { ...item, newValue: good + 1 };
        } else if (newValue === 'neutral') {
          return { ...item, newValue: neutral + 1 };
        } else if (newValue === 'bad') {
          return { ...item, newValue: bad + 1 };
        }
      }
      return item;
    });

    console.log('newValues', newValues)

    setGood(newValues[0].newValue)
    setNeutral(newValues[1].newValue)
    setBad(newValues[2].newValue)
  }

  return (
    <div>
      <Titles value="give feedback" />
      <Button onClick={() => setToValue("good")} text="good" />
      <Button onClick={() => setToValue("neutral")} text="neutral" />
      <Button onClick={() => setToValue("bad")} text="bad" />
      <Titles value="statistics" />
      <Statistics values={values} />
    </div>
  )
}

export default App