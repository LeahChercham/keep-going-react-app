import React, { useEffect, useState } from 'react';
import { FormControl } from "@mui/material";
import { TextField } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux' // dispatch actions to the store
import { userLogin } from '../store/actions/authActions';

import { CLEAR_ERROR } from '../store/types/authType';


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

function Login(props) {

    const [state, setState] = useState({
        password: "",
        problem: "",
        username: "",
        redirect: false
    })
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { loading, authenticated, error, successMessage, user } = useSelector(state => state.auth);

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.id]: event.target.value
        })
    }

    const handleSubmit = async (event) => {
        debugger
        event.preventDefault();
        login(state.username, state.password);
    }

    const login = async (username, password) => {
        let data = {
            username,
            password
        }
        await dispatch(userLogin(data))
    }

    useEffect(() => {
        if (authenticated) {
            navigate("/search")
        }
        if (error) {
            alert.error(error)
            dispatch({ type: 'CLEAR_ERROR' })
        }
    }
    )

    return (
        <div>
            <div style={{ marginLeft: "4em", marginRight: "4em" }}>
                <div style={styles.text.header}>Log In</div>
                <FormControl style={styles.main}>
                    <div>
                        <TextField
                            id="username"
                            label="Username"
                            value={state.username}
                            onChange={handleChange}
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
                            value={state.password}
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
                            Log In
                        </Button>
                    </div>
                    <div>
                        {state.problem}
                    </div>
                </FormControl>
            </div >
        </div>
    )


}

export default Login;