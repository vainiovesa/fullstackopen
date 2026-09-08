const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (type === 'error') {
    notificationStyle.color = 'red'
  }

  return (
    <div className="notification" style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification
