import { useDebugValue } from 'react'
import { useState } from 'react'


const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({ text, value, after }) => {
  return (
    <div>
      {text} {value} {after}
    </div>
  )
}

const Statistics = (props) => {
  const [good, neutral, bad] = props.stats

  if (good === 0 && neutral === 0 && bad === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  const total = good + neutral + bad
  const average = (good - bad) / total || 0
  const positive = good / total || 0

  return (
    <div>
      <StatisticLine text={'good'} value={good} />
      <StatisticLine text={'neutral'} value={neutral} />
      <StatisticLine text={'bad'} value={bad} />
      <StatisticLine text={'all'} value={total} />
      <StatisticLine text={'average'} value={average} />
      <StatisticLine text={'positive'} value={positive * 100} after={'%'} />
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>

      <h2>Give feedback</h2>
      <Button onClick={handleGoodClick} text={'good'} />
      <Button onClick={handleNeutralClick} text={'neutral'} />
      <Button onClick={handleBadClick} text={'bad'} />

      <h2>Statistics</h2>
      <Statistics stats={[good, neutral, bad]} />

    </div>
  )
}

export default App
