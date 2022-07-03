import React, { Component } from 'react';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import NavBar from './Components/NavBar';
import LandingPage from './Components/LandingPage';
import SearchPage from './Components/SearchPage';
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

          <Route path="/Search" exact render={() =>
            <SearchPage />}>
          </Route>

</Routes>

      </BrowserRouter>
    )
  }
}

export default App;
