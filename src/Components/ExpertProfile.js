import React, { Component } from 'react';
import Button from '@mui/material/Button';
import { FormControl, Switch } from "@mui/material";
import { TextField } from "@mui/material";
import { FormHelperText } from "@mui/material";
import Axios from '../../node_modules/axios';
import consts from '../consts'
import ChatRoom from './ChatRoom';
const CREATE_ROUTE = consts.CREATE_ROUTE
const util = require('util')

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
    containerOne: {
        maxWidth: "30%",
        display: "flex",
        flexFlow: "column",
        justifyContent: "center",
        height: "100%",
    },
    username: {
        display: 'flex',
        fontSize: '4em'
    },
    mainExpertise: {
        display: 'flex',
        fontSize: '2em'
    },
    keywords: {
        display: 'flex',
        fontSize: '2em'
    }

}
class ExpertProfile extends Component {
    constructor() {
        super();
        this.state = {
            expert: {
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
        }
    }


    render() {
        let expert = this.props.location.state
        return (
            <div style={styles.main}>
                <div style={styles.containerOne}>
                    <div style={styles.username}>
                        {expert.username}
                    </div>
                    <div style={styles.mainExpertise}>
                        {expert.mainExpertise}
                    </div>

                    <div style={styles.keywords}>
                        {expert.mainExpertiseKeywords}
                    </div>
                    <div>
                        1 Token / 15 Minutes
                    </div>

                    <div>

                        <Button
                            variant="contained"
                            color="primary"
                        // onClick={(e) => this.handleSubmit(e)}
                        >
                            CONTACT ME
                        </Button>

                    </div>
                </div>
                <ChatRoom />
            </div>
        )
    }

}

export default ExpertProfile;