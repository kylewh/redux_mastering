import React from 'react'
import { NavLink } from 'react-router-dom'

const FilterLink = ({ filter, children }) => {
  
  console.log(filter)
  
  return(
  <NavLink
    exact={true}
    to={filter === 'all' ? '/' : `/${filter}`}
    activeStyle={{
      textDecoration: 'none',
      color: 'black'
    }}
  >
    {children}
  </NavLink>
)}

export default FilterLink
