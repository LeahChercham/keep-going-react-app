import React, { useState } from 'react';
import { FormControl } from "@mui/material";
import { TextField } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { Button } from "@mui/material";
import { Navigate } from 'react-router-dom';
import Axios from 'axios';
import consts from '../consts'

import { useDispatch } from 'react-redux' // dispatch actions to the store
import { userRegister } from '../store/actions/authActions';
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


function Signup(props) {

    const [state, setState] = useState({
        newUser: {
            email: "",
            password: "",
            username: "",
            usernameTaken: false,
            emailTaken: false,
            mainExpertise: "",
            mainExpertiseKeywords: "",
            otherKeywords: "",
            tokens: 50,
        },
        confirmPassword: "",
        error: "",
        redirect: false
    })

    const dispatch = useDispatch();

    const handleChange = async (event) => {
        debugger
        let newUser = { ...state.newUser }
        debugger
        switch (event.target.id) {
            case "username": handleUsername(event.target.value); break;
            case "email": handleEmail(event.target.value); break;
            case "password": {
                newUser.password = event.target.value;
                setState({
                    ...state,
                    newUser
                })

            }; break;
            case "confirmPassword": {
                let confirmPassword = event.target.value;
                setState({
                    ...state,
                    confirmPassword
                })

            };
                break;
            default: setState({
                ...state,
                newUser
            }); break;
        }
    }

    const handleUsername = async inputUsernameValue => {

        let newUser = { ...state.newUser }
        newUser.username = inputUsernameValue

        setState({
            ...state,
            newUser
        })

        if (inputUsernameValue) {
            let response = await Axios.get(CREATE_ROUTE(`user/username/${inputUsernameValue}`))
            if (response.data) {
                newUser.usernameTaken = true
            } else {
                newUser.usernameTaken = false
            }
        }
        setState({
            ...state,
            newUser
        })
    }

    const handleEmail = async inputEmailValue => {
        let newUser = { ...state.newUser }
        newUser.email = inputEmailValue

        setState({
            ...state,
            newUser
        })


        if (inputEmailValue) {
            let response = await Axios.get(CREATE_ROUTE(`user/email/${inputEmailValue}`))
            if (response.data) {
                newUser.emailTaken = true
            } else {
                newUser.emailTaken = false
            }
        }
        setState({ ...state, newUser })
    }

    const handleSubmit = event => {
        console.log(state)
        event.preventDefault();
        let newUser = { ...state.newUser }

        if (newUser.password !== state.confirmPassword) {

            setState({
                ...state,
                error: "Passwords do not match"
            })
            return;
        }

        if (newUser.username && newUser.email && newUser.password && !newUser.usernameTaken && !newUser.emailTaken && newUser.password === state.confirmPassword) {
            signUp();
        }
    }

    // To do: use function from authActions (reducer)
    // Should I use FormData ?
    const signUp = () => {
        let userData = { ...state.newUser }

        dispatch(userRegister(userData)).then(() => {
            login()
        })

    }

    const login = async () => {
        let loginSuccessfull = await props.login(state.newUser.username, state.newUser.password);
        loginSuccessfull ? setState({ ...state, redirect: true }) : setState({ ...state, error: "Login failed" });
    }


    const { redirect, error } = { ...state };

    if (redirect) {
        return <Navigate to="/search" />
    } else {
        return (
            < div >
                <div style={{ marginLeft: "4em", marginRight: "4em" }}>
                    <div style={styles.text.header}>Sign Up</div>
                    <FormControl style={styles.main} >
                        <div>
                            <TextField
                                error={state.newUser.usernameTaken}
                                id="username"
                                label="Username"
                                value={state.newUser.username}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />
                            <FormHelperText id="my-helper-text">{state.newUser.usernameTaken ? "Username already taken" : ""}</FormHelperText>
                        </div>
                        <div>
                            <TextField
                                error={state.newUser.emailTaken}
                                id="email"
                                label="Email"
                                value={state.newUser.email}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />
                            <FormHelperText id="my-helper-text">{state.newUser.emailTaken ? "An account with this e-mail address already exists" : ""}</FormHelperText>
                        </div>
                        <div>
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                value={state.newUser.password}
                                onChange={handleChange}
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
                                value={state.confirmPassword}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />
                        </div>

                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}>
                                Sign Up
                            </Button>
                        </div>
                        <div>
                            {state.error}
                        </div>
                    </FormControl>
                </div >
            </div>
        )
    }
}


export default Signup;