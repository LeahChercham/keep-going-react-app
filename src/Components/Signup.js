import React, { Component } from 'react';
import { FormControl } from "@mui/material";
import { TextField } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { Button } from "@mui/material";
import { Navigate } from 'react-router';
import Axios from '../../node_modules/axios';
import consts from '../consts'
const CREATE_ROUTE = consts.CREATE_ROUTE

const styles = {
    main: {
        display: "flex",
        flexFlow: "column",
        justifyContent: "space-evenly",
        alignContent: "center"
    },
    text: {
        header: {
            fontSize: "2em",
            marginTop: "0.5em",
            display: "flex",
            justifyContent: "center",
            color: "#0F202A"
        }
    }
}

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newUser: {
                email: "",
                password: "",
                username: "",
                usernameTaken: false,
                emailTaken: false,
                mainExpertise: "",
                mainExpertiseKeywords: [],
                otherKeywords: [],
                tokens: 50,
            },
            confirmPassword: "",
            error: "",
            redirect: false
        }
    }

    handleChange = async (event) => {
        switch (event.target.id) {
            case "username": this.handleUsername(event.target.value); break;
            case "email": this.handleEmail(event.target.value); break;
            case "password": {
                let state = { ...this.state }
                state.newUser.password = event.target.value
                this.setState({ state })
            }; break;
            default: this.setState({
                [event.target.id]: event.target.value
            }); break;
        }
    }

    handleUsername = async inputUsernameValue => {

        let newUser = { ...this.state.newUser }
        newUser.username = inputUsernameValue
        this.setState({ newUser })

        if (inputUsernameValue) {
            let response = await Axios.get(CREATE_ROUTE(`user/username/${inputUsernameValue}`))
            if (response.data) {
                newUser.usernameTaken = true
            } else {
                newUser.usernameTaken = false
            }
        }
        this.setState({ newUser })
    }

    handleEmail = async inputEmailValue => {
        let newUser = { ...this.state.newUser }
        newUser.email = inputEmailValue
        this.setState({ newUser })
        if (inputEmailValue) {
            let response = await Axios.get(CREATE_ROUTE(`user/email/${inputEmailValue}`))
            if (response.data) {
                newUser.emailTaken = true
            } else {
                newUser.emailTaken = false
            }
        }
        this.setState({ newUser })
    }

    handleSubmit = (event) => {
        console.log(this.state)
        event.preventDefault();
        let newUser = { ...this.state.newUser }

        if (newUser.password !== this.state.confirmPassword) {
            this.setState({
                error: "Passwords do not match"
            })
            return;
        }

        if (newUser.username && newUser.email && newUser.password && !newUser.usernameTaken && !newUser.emailTaken && newUser.password === this.state.confirmPassword) {
            this.signUp();
        }
    }

    signUp = () => {
        let userData = { ...this.state.newUser }
        Axios.post(CREATE_ROUTE("user"), userData).then(() => {
            this.login()
        })

    }

    login = async () => {
        let loginSuccessfull = await this.props.login(this.state.newUser.username, this.state.newUser.password);
        loginSuccessfull ? this.setState({ redirect: true }) : this.setState({ error: "Login failed" });
    }


    render() {
        const { redirect, error } = this.state;

        if (redirect) {
            return <Navigate to='/search' />;
        } else return (
            <div>
                <div style={{ marginLeft: "4em", marginRight: "4em" }}>
                    <div style={styles.text.header}>Sign Up</div>
                    <FormControl style={styles.main} >
                        <div>
                            <TextField
                                error={this.state.newUser.usernameTaken}
                                id="username"
                                label="Username"
                                value={this.state.newUser.username}
                                onChange={this.handleChange}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />
                            <FormHelperText id="my-helper-text">{this.state.newUser.usernameTaken ? "Username already taken" : ""}</FormHelperText>
                        </div>
                        <div>
                            <TextField
                                error={this.state.newUser.emailTaken}
                                id="email"
                                label="Email"
                                value={this.state.newUser.email}
                                onChange={this.handleChange}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />
                            <FormHelperText id="my-helper-text">{this.state.newUser.emailTaken ? "An account with this e-mail address already exists" : ""}</FormHelperText>
                        </div>
                        <div>
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                value={this.state.newUser.password}
                                onChange={this.handleChange}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />
                            <FormHelperText id="my-helper-text">Chose a strong password.</FormHelperText>
                        </div>
                        <div>
                            <TextField
                                id="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                value={this.state.confirmPassword}
                                onChange={this.handleChange}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />
                        </div>

                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleSubmit}>
                                Sign Up
                            </Button>
                        </div>
                        <div>
                            {this.state.error}
                        </div>
                    </FormControl>
                </div >
            </div>
        )
    }

}

export default Signup;