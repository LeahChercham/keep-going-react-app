import React, { Component } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Input } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Axios from 'axios';
import consts from '../consts'
const CREATE_ROUTE = consts.CREATE_ROUTE



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
class SearchPage extends Component {
    constructor() {
        super();
        this.state = {
            redirect: false,
            input: "",
            results: []
        }
    }

    handleChange = (event) => {
        event.preventDefault();
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let state = { ...this.state }
        let input = state.input
        input = input.toLowerCase()
        let searchTerms = input.split(" ")


        this.search(searchTerms);
    }

    search = async (searchTerms) => {
        let results = []

        let response = await Axios.get(CREATE_ROUTE('user/search'), {
            params: {
                data: searchTerms
            }
        })

        if (response.data) {
            let results = { ...this.state.results }
            let redirect = { ...this.state.redirect }
            results = response.data
            redirect = true
            this.setState({ results, redirect })
        }
    }




    render() {
        const { redirect, results } = this.state;


        if (redirect) {
            return <Navigate to="/results"  state={ results }  />  // local storage ?? 

        } else return (
            <div style={styles.main}>
                <div style={styles.header} >
                    Find the expert to help you keep your project going
                </div>
                <div style={styles.secondRow}>
                    <SearchIcon style={styles.icon} />
                    <div style={styles.inputDiv}>
                        <Input id="input" onChange={this.handleChange} style={styles.input} type="search" placeholder="Try “React Native navigation”" />
                    </div>
                    <div style={styles.buttonDiv}>
                        <RouterLink to="/results" style={{ textDecoration: "none" }}>
                            <Button
                                onClick={this.handleSubmit}
                                style={styles.menuButton}>Search</Button>
                        </RouterLink>
                    </div>
                </div>
            </div>
        )
    }

}

export default SearchPage;