import { useState } from 'react'

const Titles = props => <div><h1>{props.title}</h1></div>

const RandomAnecdote = props => {
<div>
  <p>{
    props.anecdotes[props.selected]} <br />
    has {props.votes[props.selected] || 0} votes
  </p>
</div>
}

const MaxAnecdote = (props) => {
  console.log("props", props)
  console.log("props.votes", props.votes)
  // getting the key with the highest value by turning the object into an array of key-value pairs and then using reduce to find the key with the highest value
  const max = Object.entries(props.votes).reduce((maxKey, [key, value]) => {
    console.log("maxKey", maxKey)
    return value > (props.votes[maxKey] || 0) ? key : maxKey
  }, Object.keys(props.votes)[0] || 0) 

  console.log("max", max)

  return (
    <div>
      {max === 0 ? (
        <p>No votes yet</p>
      ) : (
        <p>
          {props.anecdotes[max]}<br />
          has {props.votes[max]} votes
        </p>
      )}
    </div>
  );
};

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState({})

  const handleVote = () => {
    const copy = { ...votes }
    copy[selected] = (copy[selected] || 0) + 1
    setVotes(copy)
  }

  console.log(votes)

  const handleNextAnecdote = () => {
    const random = Math.floor(Math.random() * anecdotes.length)
    setSelected(random)
  }

  console.log(selected)

  return (
    <div>
      <Titles title="Anecdote of the day" />
      <RandomAnecdote anecdotes={anecdotes} selected={selected} votes={votes} />
      <p>
        {anecdotes[selected]}<br />
        has {votes[selected] || 0} votes
      </p>
      <Button onClick={handleVote} text="Vote" />
      <Button onClick={handleNextAnecdote} text="Next anecdote" />
      <Titles title="Anecdote with most votes" />
      <MaxAnecdote anecdotes={anecdotes} votes={votes} />

    </div>
  )
}

export default App