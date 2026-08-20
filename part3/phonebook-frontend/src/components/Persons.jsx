const Person = ({ name, number, remove}) => {
  return (
    <div>
      {name} {number}
      <button onClick={remove}>remove</button>
    </div>
  )
}

const Persons = ({ numbersToShow, remove }) => {
  const toShow = numbersToShow.map(p => 
    <Person key={p.id} name={p.name} number={p.number} remove={() => remove(p.id)}/>
  )
  return (
    <div>
      {toShow}
    </div>
  )
}

export default Persons
