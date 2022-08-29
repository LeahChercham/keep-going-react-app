import React, { Component, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { FormControl, Switch } from "@mui/material";
import { TextField } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux'
import Axios from 'axios';
import consts from '../consts'
const CREATE_ROUTE = consts.CREATE_ROUTE
import {userUpdate} from '../store/actions/authActions'

const styles = {
    main: {
        display: "flex",
        flexFlow: "row",
        justifyContent: "center",
        height: "100%",
    },
    menuButton: {
        fontWeight: 500,
        fontSize: "1em",
        color: "#FFFFFF",
        backgroundColor: "#063A5B",
    },
    containerOne: {},
    containerTwo: {},

}
function Profile(props) {

    const [state, setState] = useState({
        status: "View",
        user: {
            email: "",
            password: "",
            username: "",
            usernameTaken: false,
            emailTaken: false,
            mainExpertise: "",
            mainExpertiseKeywords: "",
            otherKeywords: "",
            tokens: 0,
        },
        updateUser: {
            email: "",
            password: "",
            username: "",
            usernameTaken: false,
            emailTaken: false,
            mainExpertise: "",
            mainExpertiseKeywords: "",
            otherKeywords: "",
            tokens: 0,
        }
    })

    const dispatch = useDispatch()

    const { loading, authenticated, error, successMessage, user } = useSelector(state => state.auth);

    useEffect(() => {
        setState({ ...state, user })
    }, [])


    const handleChange = (event) => {
        let updateUser = { ...state.updateUser }
        updateUser[event.target.id] = event.target.value
        setState({ ...state, updateUser })
    }

    const handleSubmit = (event, status) => {
        event.preventDefault();

        switch (status) {
            case "View": {
                status = "Edit"
                setState({ ...state, status })
            }; break;
            case "Edit": {
                updateUser()
                // hier zu DB schicken
                status = "View"
                setState({ ...state, status })
            }; break;
            default:
                break;
        }
    }

    const updateUser = () => {
        let updateUser = { ...state.updateUser }
        let username = { ...state.user.username }
        let data = { updateUser, username }
        dispatch(userUpdate(data))
    }

    return (
        <div>
            <FormControl style={styles.main} >
                <div style={styles.main}>
                    <div style={styles.containerOne}>
                        <div>
                            <TextField
                                disabled={state.status === "View" ? true : false}
                                error={state.updateUser.usernameTaken}
                                id="username"
                                label="Username"
                                value={state.updateUser.username}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />
                            <FormHelperText id="my-helper-text">{state.updateUser.usernameTaken ? "Username already taken" : ""}</FormHelperText>
                        </div>
                        <div>
                            <TextField
                                disabled={state.status === "View" ? true : false}
                                error={state.updateUser.emailTaken}
                                id="email"
                                label="Email"
                                value={state.updateUser.email}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />
                            <FormHelperText id="my-helper-text">{state.updateUser.emailTaken ? "An account with this e-mail address already exists" : ""}</FormHelperText>
                        </div>
                    </div>

                    <div style={styles.containerTwo}>

                        <div>
                            <TextField
                                disabled={state.status === "View" ? true : true} // always disabled
                                id="tokens"
                                label="Tokens"
                                value={state.updateUser.tokens}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />
                            {/* <FormHelperText id="my-helper-text"></FormHelperText> */}
                        </div>
                        <div>
                            <TextField
                                disabled={state.status === "View" ? true : false}
                                id="mainExpertise"
                                label="Expertise"
                                value={state.updateUser.mainExpertise}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />
                            <div>Enter Keywords separated by semicolons ;</div>
                            {/* Hier vorschläge für schon existierende Stichwörter vorschlagen */}
                            <TextField
                                multiline
                                disabled={state.status === "View" ? true : false}
                                id="mainExpertiseKeywords"
                                label="Keywords"
                                value={state.updateUser.mainExpertiseKeywords}
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
                                // currentStatus="Edit"
                                onClick={(e) => handleSubmit(e, state.status)}>
                                {state.status === "View" ? "Edit" : "Save"}
                            </Button>

                        </div>
                        <div>
                            {state.error}
                        </div>
                    </div>
                </div>
            </FormControl>
        </div>
    )

}

export default Profile;