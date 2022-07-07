import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './Components/NavBar';
import LandingPage from './Components/LandingPage';
import SearchPage from './Components/SearchPage';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Results from './Components/Results';
import './App.css';
import Axios from '../node_modules/axios';
import consts from './consts'
const CREATE_ROUTE = consts.CREATE_ROUTE



const styles = {
  main: { display: "flex", flexFlow: "column" }
}
class App extends Component {
  constructor() {
    super()
    this.state = {
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
        },
      }
    }
  } s

  //* Lifecycle Method */
  componentDidMount() {
    let login
    if (localStorage.login) { // If the user did already connect through that browser, make him logged in automatically
      login = JSON.parse(localStorage.login)
    } else {
      login = { ...this.state.login } // Keep the state as it is
    }
    this.setState({ login }) // Update the state
  }


  login = async (username, password) => {
    if (!password) { alert("Please enter your password.") }

    let response = await Axios.get(CREATE_ROUTE(`login/${username}/${password}`)) // asynchronous function
    if (response.data.allowLogin) {
      let login = { isLoggedIn: true, user: response.data.user }
      localStorage.login = JSON.stringify(login)
      this.setState({ login: login })
      return true
    } else {
      // alert("The combination of password and username is not correct.")
      return false
    }
  }

  logout = () => {
    localStorage.clear()
    let login = { user: {}, isLoggedIn: false }
    this.setState({ login })
  }

  render() {
    return (

      <BrowserRouter>
        <div style={styles.main}>

          <NavBar username={this.state.login.user.username} isLoggedIn={this.state.login.isLoggedIn} logout={this.logout}>
          </NavBar>


          <div className="page">
            <Routes>
              <Route path="/" element={
                (this.state.login.isLoggedIn ?
                  (<SearchPage />) :
                  (<LandingPage />))}>
              </Route>


              <Route path="/search" element={
                (this.state.login.isLoggedIn ?
                  (<SearchPage />) :
                  (<LandingPage />))
              }>
              </Route>

              <Route path="/login" element={
                <Login login={this.login} loginStatus={this.state.login} />}>
              </Route>
              <Route path="/results" element={
                <Results />}>
              </Route>
              <Route path="/register" element={
                <Signup />}>
              </Route>

            </Routes>

          </div>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
