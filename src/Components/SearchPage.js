import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Input } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Axios from 'axios';
import consts from '../consts'
const CREATE_ROUTE = consts.CREATE_ROUTE
const util = require('util')


const styles = {
    main: {
        display: "flex",
        flexFlow: "column",
        justifyContent: "center",
        height: "100%",
    },
    secondRow: {
        justifyContent: "space-evenly",
        display: "flex",
        flexFlow: "row"
    },
    header: {
        color: "#063A5B",
        fontSize: "3em",
        display: "flex",
        flexFlow: "row",
        justifyContent: "space-evenly",
        flex: "0 1 10%",
    },
    inputDiv: {
        color: "#063A5B",
        fontSize: "2em",
        flex: "0 1 60%",
    },
    buttonDiv: {
        flex: "0 1 20%",
        alignSelf: "center"
    },
    menuButton: {
        flex: "0 1 30%",
        fontWeight: 500,
        fontSize: "1em",
        color: "#FFFFFF",
        backgroundColor: "#063A5B",
        width: "60%"
    },
    input: {
        width: "100%",
        fontSize: "1em",
    },
    icon: {
        fontSize: "2.5em",
        alignSelf: "center",
    }

}
function SearchPage(props) {

    const [state, setState] = useState({
        redirect: false,
        input: "",
        results: []
    })

    const navigate = useNavigate();
    const handleChange = (event) => {
        event.preventDefault();
        setState({
            ...state,
            [event.target.id]: event.target.value
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let input = state.input
        input = input.toLowerCase()
        let searchTerms = input.split(" ")


        search(searchTerms);
    }

    const search = async (searchTerms) => {
        let results = []

        let response = await Axios.get(CREATE_ROUTE('user/search'), {
            params: {
                data: searchTerms
            }
        })

        if (response.data) {
            let results = state.results
            let redirect = state.redirect
            results = response.data
            redirect = true
            setState({ ...state, results, redirect })
        }
    }

    useEffect(() => {
        if (state.redirect) {
            return navigate('/results', { state: { results: state.results } })
        }
    }, [state.redirect])

    return (
        <div style={styles.main}>
            <div style={styles.header} >
                Find the expert to help you keep your project going
            </div>
            <div style={styles.secondRow}>
                <SearchIcon style={styles.icon} />
                <div style={styles.inputDiv}>
                    <Input id="input" onChange={handleChange} style={styles.input} type="search" placeholder="Try “React Native navigation”" />
                </div>
                <div style={styles.buttonDiv}>
                    <RouterLink to="/results" style={{ textDecoration: "none" }}>
                        <Button
                            onClick={handleSubmit}
                            style={styles.menuButton}>Search</Button>
                    </RouterLink>
                </div>
            </div>
        </div>
    )
}



export default SearchPage;