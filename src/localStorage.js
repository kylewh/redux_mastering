export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state')
    return serializedState === null ? undefined :  JSON.parse(serializedState)
  }  catch (err) {
    return undefined
  }
}

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state) //JSON.stringify is expensive 
    localStorage.setItem('state', serializedState)
    console.log('done')
    console.log(state)
  } catch (err) {
    throw Error(serializedState)
  }
}