import React, { Component } from 'react';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import NavBar from './Components/NavBar';
import LandingPage from './Components/LandingPage';
import SearchPage from './Components/SearchPage';
import Signup from './Components/Signup';
import Login from './Components/Login';
import './App.css';

class App extends Component {
  constructor(){
    super()
    this.state = {
      userName:"",
      isOnline:true
    }
  }

  updateUserName = (name) => {
    this.setState({
      userName: name
    })
  }

  render(){
    return(
      <BrowserRouter>
        <NavBar name={this.state.userName}>

        </NavBar>
<Routes>
        <Route path="/" exact render={() =>
            (this.state.userName ?
              (<Navigate to="/Search" />) :
              (<LandingPage updateUser={this.updateUser}
                 />))}>
          </Route>

          <Route path="/search" exact render={() =>
            <SearchPage />}>
          </Route>
          <Route path="/login" exact render={() =>
            <Login />}>
          </Route>
          <Route path="/register" exact render={() =>
            <Signup />}>
          </Route>

</Routes>

      </BrowserRouter>
    )
  }
}

export default App;
