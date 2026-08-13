const Header = ({ course }) => <h1>{course}</h1>

const Content = ({ parts }) => {
  return parts.map(part => <Part key={part.id} part={part} />)
}

const Part = ({ part }) => (
  <p>
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

export default Course
