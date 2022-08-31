import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
// import { USER_LOGIN_SUCCESS } from '../store/types/authType';
import { USER_LOGIN_SUCCESS } from './store/types/authType';

import NavBar from './Components/NavBar';
import LandingPage from './Components/LandingPage';
import SearchPage from './Components/SearchPage';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Profile from './Components/Profile';
import Results from './Components/Results';
import './App.css';
import consts from './consts'
import './main.scss';
import { useDispatch, useSelector } from 'react-redux';
import ExpertProfile from './Components/ExpertProfile';
import Messenger from './Components/messenger/Messenger';
import { userLogin } from './store/actions/authActions';
const CREATE_ROUTE = consts.CREATE_ROUTE


const styles = {
  main: { display: "flex", flexFlow: "column" }
}
function App(props) {

  const [state, setState] = useState({
    login: {
      isLoggedIn: false,
      user: {
        email: "",
        password: "",
        username: "",
        usernameTaken: false,
        emailTaken: false,
        mainExpertise: "",
        mainExpertiseKeywords: [],
        otherKeywords: [],
        tokens: 0,
      },
    }, title: "", currentPage: ""
  });

  const { loading, authenticated, error, successMessage, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();


  useEffect(() => {
    let user = localStorage.login ? JSON.parse(localStorage.login).user : null
    console.log("useEffect" + user)
    if (user) {
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: {
          successMessage: "Logged in from LocalStorage",
          user: user
        }
      })
    }
    console.log("authenticated" + authenticated)

  }, [])


  return (

    < BrowserRouter >
      <div style={styles.main}>

        <NavBar />


        <div className="page">
          <Routes>
            <Route path="/" element={
              (authenticated ?
                (<Navigate to="/search" />) :
                (<LandingPage />))}>
            </Route>


            <Route path="/search" element={
              (authenticated ?
                (<SearchPage />) :
                (<LandingPage />))
            }>
            </Route>

            <Route path="/login" element={
              <Login />}>
            </Route>
            <Route path="/results" element={
              (authenticated ?
                (<Results />) :
                (<Navigate to="/" />))
            }>
            </Route>
            <Route path="/register" element={
              <Signup />}>
            </Route>
            <Route path="/profile" element={
              (authenticated ?
                (<Profile />) :
                (<Navigate to="/" />))
            }>
            </Route>

            <Route path="/expert" element={
              (authenticated ?
                (<ExpertProfile />) :
                (<Navigate to="/" />))
            }>
            </Route>

            <Route path="/chat" element={
              (authenticated ?
                (<Messenger />) :
                (<Navigate to="/" />))
            }>
            </Route>

          </Routes>

        </div>
      </div>
    </BrowserRouter >
  )
}


export default App;
