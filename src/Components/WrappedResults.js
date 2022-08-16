import React, { Component } from 'react';
import Results from './Results'
import {useNavigate, useLocation} from 'react-router-dom'

const WrappedResults = props => {
  const history = useNavigate()
  const location = useLocation()

  return <Results history={history} location={location} {...props} />
}

export default WrappedResults;