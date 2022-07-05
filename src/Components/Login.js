import React, { Component } from 'react';
import { FormControl } from "@mui/material";
import { TextField } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Input } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { Button } from "@mui/material";

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
            display:"flex",
            justifyContent:"center",
            color: "#0F202A"
        }
    }
}

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            error: "",
            username: ""
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.password !== this.state.confirmPassword) { // here check if password correct
            this.setState({
                error: "Passwords not correct"
            })
        } else { // Function to create
            this.props.Login(this.state.email, this.state.password, this.state.username);
        }
    }


    render() {
        return (
            <div>
                <div style={{ marginLeft: "4em", marginRight: "4em" }}>
                    <div style={styles.text.header}>Log In</div>
                    <FormControl style={styles.main}>
                        <div>
                            <TextField
                                id="username or email"
                                label="Username or Email"
                                value={this.state.username}
                                onChange={this.handleChange}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />
                            <FormHelperText id="my-helper-text">Use your Username or Email to log in.</FormHelperText>
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
                            {this.state.error}
                        </div>
                    </FormControl>
                </div >
            </div>
        )
    }

}

export default Login;