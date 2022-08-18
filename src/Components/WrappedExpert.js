import React, { Component } from 'react';
import ExpertProfile from './ExpertProfile'
import {useNavigate, useLocation} from 'react-router-dom'

const WrappedExpert = props => {
  const history = useNavigate()
  const location = useLocation()

  return <ExpertProfile history={history} location={location} {...props} />
}

export default WrappedExpert;