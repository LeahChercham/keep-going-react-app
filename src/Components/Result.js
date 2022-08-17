import React, { Component } from 'react';
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

        }
    }

    render() {
        console.log(util.inspect(this.props.result, false, 7))
        console.log("in result component:" + this.props.result.username)

        let keywordsList = this.props ? this.props.result.mainExpertiseKeywords.split(";") : []
        return (
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
                    <Button style={styles.button}>
                        SEE MORE
                    </Button>
                    <div style={styles.tokens}>
                        {this.props.result.tokens}
                    </div>
                </Box>

            </div>
        )
    }

}

export default Result;