import { Component } from "react";
import { FormControl } from "@mui/material";
import { TextField } from "@mui/material";
import {InputLabel} from "@mui/material";
import {Input} from "@mui/material";
import {FormHelperText} from "@mui/material";


class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div>

                "Signup Page"
                <FormControl>
                    <InputLabel htmlFor="my-input">Email address</InputLabel>
                    <Input id="my-input" aria-describedby="my-helper-text" />
                    <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                </FormControl>

            </div>
        )
    }
}

export default Signup;