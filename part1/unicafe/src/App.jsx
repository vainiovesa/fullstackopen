import { useDebugValue } from 'react'
import { useState } from 'react'


const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Statistic = (props) => {
  const [good, neutral, bad] = props.stats
  const total = good + neutral + bad
  const average = (good - bad) / total || 0
  const positive = good / total || 0

  return (
    <div>
      <div>
        good {good}
      </div>
      <div>
        neutral {neutral}
      </div>
      <div>
        bad {bad}
      </div>
      <div>
        all {total}
      </div>
      <div>
        average {average}
      </div>
      <div>
        positive {positive * 100} %
      </div>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    console.log('Before', good);
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    console.log('Before', neutral);
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    console.log('Before', bad);
    setBad(bad + 1)
  }

  return (
    <div>

      <h2>Give feedback</h2>
      <Button onClick={handleGoodClick} text={'good'} />
      <Button onClick={handleNeutralClick} text={'neutral'} />
      <Button onClick={handleBadClick} text={'bad'} />

      <h2>Statistics</h2>
      <Statistic stats={[good, neutral, bad]} />

    </div>
  )
}

export default App
