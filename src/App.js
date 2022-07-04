import React, { Component } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './Components/NavBar';
import LandingPage from './Components/LandingPage';
import SearchPage from './Components/SearchPage';
import Signup from './Components/Signup';
import Login from './Components/Login';
import './App.css';


const styles = {
  main: { marginTop:100} // to position stuff under header
}
class App extends Component {
  constructor() {
    super()
    this.state = {
      userName: false,
      isOnline: true
    }
  }

  updateUserName = (name) => {
    this.setState({
      userName: name
    })
  }

  render() {
    return (

      <BrowserRouter>
        <div>

          <NavBar name={this.state.userName}>
          </NavBar>


          <div style={styles.main}>
            <Routes>
              <Route path="/" element={
                (this.state.userName ?
                  (<Navigate to="/search" />) :
                  (<LandingPage updateUser={this.updateUser}
                  />))}>
              </Route>

              <Route path="/" element={<LandingPage />}></Route>

              <Route path="/search" element={
                <SearchPage />}>
              </Route>
              <Route path="/login" element={
                <Login />}>
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
