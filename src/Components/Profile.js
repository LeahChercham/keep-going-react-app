import React, { Component } from 'react';
import Button from '@mui/material/Button';
import { FormControl, Switch } from "@mui/material";
import { TextField } from "@mui/material";
import { FormHelperText } from "@mui/material";
import Axios from '../../node_modules/axios';
import consts from '../consts'
const CREATE_ROUTE = consts.CREATE_ROUTE

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
class Profile extends Component {
    constructor() {
        super();
        this.state = {
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
        }
    }

    componentDidMount() {
        this.setState({
            user: this.props.user,
            updateUser: this.props.user,
            status: "View",
        })
    }

    handleChange = (event) => { //
        let updateUser = { ...this.state.updateUser }
        updateUser[event.target.id] = event.target.value
        this.setState({ updateUser })
    }

    handleSubmit = (event, status) => {
        event.preventDefault();

        switch (status) {
            case "View": {
                status = "Edit"
                this.setState({ status })
            }; break;
            case "Edit": {
                this.updateUser()
                // hier zu DB schicken
                status = "View"
                this.setState({ status })
            }; break;
            default:
                break;
        }
    }

    updateUser = async () => {
        let updateUser = { ...this.state.updateUser }
        let updateSuccessful = await Axios.put(CREATE_ROUTE(`user/${this.state.user.username}`), updateUser).then(res => {this.setState({user: res.data})})

        updateSuccessful ? this.setState({ updateSuccessful: true }) : this.setState({ updateSuccessful: false })
    }

    render() {
        return (
            <div>
                <FormControl style={styles.main} >
                    <div style={styles.main}>
                        <div style={styles.containerOne}>
                            <div>
                                <TextField
                                    disabled={this.state.status === "View" ? true : false}
                                    error={this.state.updateUser.usernameTaken}
                                    id="username"
                                    label="Username"
                                    value={this.state.updateUser.username}
                                    onChange={this.handleChange}
                                    margin="normal"
                                    variant="outlined"
                                    style={{ width: "100%" }}
                                />
                                <FormHelperText id="my-helper-text">{this.state.updateUser.usernameTaken ? "Username already taken" : ""}</FormHelperText>
                            </div>
                            <div>
                                <TextField
                                    disabled={this.state.status === "View" ? true : false}
                                    error={this.state.updateUser.emailTaken}
                                    id="email"
                                    label="Email"
                                    value={this.state.updateUser.email}
                                    onChange={this.handleChange}
                                    margin="normal"
                                    variant="outlined"
                                    style={{ width: "100%" }}
                                />
                                <FormHelperText id="my-helper-text">{this.state.updateUser.emailTaken ? "An account with this e-mail address already exists" : ""}</FormHelperText>
                            </div>
                        </div>

                        <div style={styles.containerTwo}>

                            <div>
                                <TextField
                                    disabled={this.state.status === "View" ? true : true} // always disabled
                                    id="tokens"
                                    label="Tokens"
                                    value={this.state.updateUser.tokens}
                                    margin="normal"
                                    variant="outlined"
                                    style={{ width: "100%" }}
                                />
                                {/* <FormHelperText id="my-helper-text"></FormHelperText> */}
                            </div>
                            <div>
                                <TextField
                                    disabled={this.state.status === "View" ? true : false}
                                    id="mainExpertise"
                                    label="Expertise"
                                    value={this.state.updateUser.mainExpertise}
                                    onChange={this.handleChange}
                                    margin="normal"
                                    variant="outlined"
                                    style={{ width: "100%" }}
                                />
                                <div>Enter Keywords separated by semicolons ;</div>
                                {/* Hier vorschläge für schon existierende Stichwörter vorschlagen */}
                                <TextField
                                    multiline
                                    disabled={this.state.status === "View" ? true : false}
                                    id="mainExpertiseKeywords"
                                    label="Keywords"
                                    value={this.state.updateUser.mainExpertiseKeywords}
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
                                    // currentStatus="Edit"
                                    onClick={(e) => this.handleSubmit(e, this.state.status)}>
                                    {this.state.status === "View" ? "Edit" : "Save"}
                                </Button>

                            </div>
                            <div>
                                {this.state.error}
                            </div>
                        </div>
                    </div>
                </FormControl>
            </div>
        )
    }

}

export default Profile;