import React from 'react'

const FetchError = ({ message, onRetry}) => (
  <div>
    <p style={{color: 'red', fontWeight: 'bold'}}>Counld not fetch todos.</p>
    <p style={{color: 'red'}}>{message}</p>
    <button onClick={onRetry}>Retry</button>
  </div>
)

export default FetchError