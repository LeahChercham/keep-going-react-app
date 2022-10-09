import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
// import { USER_LOGIN_SUCCESS } from '../store/types/authType';
import { USER_LOGIN_SUCCESS } from './Frontend/store/types/authType';

import NavBar from './Frontend/Components/NavBar';
import LandingPage from './Frontend/Components/LandingPage';
import SearchPage from './Frontend/Components/SearchPage';
import Signup from './Frontend/Components/Signup';
import Login from './Frontend/Components/Login';
import Profile from './Frontend/Components/Profile';
import Results from './Frontend/Components/Results';
import './App.css';
import consts from './Frontend/consts'
import './Frontend/main.scss';
import { useDispatch, useSelector } from 'react-redux';
import ExpertProfile from './Frontend/Components/ExpertProfile';
import Messenger from './Frontend/Components/messenger/Messenger';
import { userLogin } from './Frontend/store/actions/authActions';

import { SocketContext, socket } from './Backend/socket/socketContext';

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
        keywords: [],
        otherKeywords: [],
        tokens: 0,
      },
    }, title: "", currentPage: ""
  });

  const { loading, authenticated, error, successMessage, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();


  useEffect(() => {
    let user = localStorage.login ? JSON.parse(localStorage.login).user : null
    if (user) {
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: {
          successMessage: "Logged in from LocalStorage",
          user: user
        }
      })
    }

  }, [])


  return (
    <SocketContext.Provider value={socket}>
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
    </SocketContext.Provider>
  )
}


export default App;
