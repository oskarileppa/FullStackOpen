const Notification = ({ error, notification }) => {
    if (error === null && notification === null) {
      return null
    }

    const message = error ? error : notification
    const className = error ? 'error' : 'notification'
  
    return (
      <div className={className}>
        {message}
      </div>
    )
  }

export default Notification