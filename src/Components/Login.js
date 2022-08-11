import React, { Component } from 'react';
import { FormControl } from "@mui/material";
import { TextField } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { Button } from "@mui/material";
import { Navigate } from 'react-router';


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

class Login extends Component {
    constructor() {
        super();
        this.state = {
            password: "",
            error: "",
            username: "",
            redirect: false
            // loginStatus: this.props.loginStatus,
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        let loginSuccessfull = await this.props.login(this.state.username, this.state.password);
        loginSuccessfull ? this.setState({ redirect: true }) : this.setState({ error: "Login failed" });
    }

    render() {
        const { redirect, error } = this.state;

        if (redirect) {
            return <Navigate to='/search' />;
        } else 
        return (
            <div>
                <div style={{ marginLeft: "4em", marginRight: "4em" }}>
                    <div style={styles.text.header}>Log In</div>
                    <FormControl style={styles.main}>
                        <div>
                            <TextField
                                id="username"
                                label="Username"
                                value={this.state.username}
                                onChange={this.handleChange}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />
                            <FormHelperText id="my-helper-text">Use your Username to log in.</FormHelperText>
                        </div>
                        <div>
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                value={this.state.password}
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
                                Log In
                            </Button>
                        </div>
                        <div>
                            {error}
                        </div>
                    </FormControl>
                </div >
            </div>
        )
    }

}

export default Login;