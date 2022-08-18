import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { Button, List, ListItem } from '@mui/material';
import Box from '@mui/material/Box';

const util = require('util')
const styles = {
    main: {
        display: "flex",
        flexFlow: "column",
    },
    box: {
        display: "flex",
        // backgroundColor: 'green',
        border: '4px solid black',
        minWidth: '300px',
        maxWidth: '300px',
        maxHeight: '300px',
        minHeight: '300px',

        alignItems: 'center',
        justifyContent: 'start',
        padding: '10px',

        flexFlow: "column",
    },
    username: {
        fontSize: '2em',
        display: 'flex',
        minHeight: '60px',
        alignItems: 'center',
    },
    expertise: {
        display: 'flex',
        fontSize: '1.5em',
        minHeight: '50px',
        alignItems: 'center',
    },
    keywords: {
        display: 'flex',
        fontSize: '1em',
        minHeight: '80px',
        alignItems: 'center',
    },
    keywords: {
        display: 'flex',
        fontSize: '1em',
        minHeight: '20px',
        alignItems: 'center',
    },
    button: {
        flex: "0 1 30%",
        fontWeight: 500,
        fontSize: "1em",
        color: "#FFFFFF",
        backgroundColor: "#063A5B",
        width: "60%"
    },
}

class Result extends Component {
    constructor() {
        super();
        this.state = {
            redirect: false,
            result: null
        }
    }

    handleSubmit = (e, expert) => {
        e.preventDefault();
        let redirect = true
        let result = expert
        this.setState({ redirect, result })

    }

    render() {
        const { redirect, result } = this.state;

        let keywordsList = this.props ? this.props.result.mainExpertiseKeywords.split(";") : []

        if (redirect) {
            return <Navigate to="/expert" state={this.props.result} />
        } else return (
            <div style={styles.main}>
                <Box style={styles.box}>
                    <div style={styles.username}>
                        {this.props.result.username}
                    </ div>
                    <div style={styles.expertise}>
                        {this.props.result.mainExpertise}
                    </div>
                    <div style={styles.keywords}>
                        {this.props.result.mainExpertiseKeywords}
                    </div>
                    <Button onClick={(e) => this.handleSubmit(e, this.props.result)} style={styles.button}>
                        SEE MORE
                    </Button>
                    <div style={styles.tokens}>
                        1 Token / 15 Minutes
                    </div>
                </Box>

            </div>
        )
    }

}

export default Result;