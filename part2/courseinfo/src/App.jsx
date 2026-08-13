const Header = ({ course }) => <h1>{course}</h1>

const Content = ({ parts }) => {
  return parts.map(part => <Part part={part} />)
}

const Part = ({ part }) => (
  <p key={part.id}>
    {part.name} {part.exercises}
  </p>
)

const Total = ({ parts }) => {
  const total = parts.map(e => e.exercises).reduce((a, b) => a + b)

  return (
    <b>Number of exercises {total}</b>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default App
