import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import { FormControl, Switch } from "@mui/material";
import { TextField } from "@mui/material";
import { FormHelperText } from "@mui/material";
import Axios from 'axios';
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
function ExpertProfile(props) {

    // const [state, setState] = useState({
    //     expert: {
    //         email: "",
    //         password: "",
    //         username: "",
    //         usernameTaken: false,
    //         emailTaken: false,
    //         mainExpertise: "",
    //         mainExpertiseKeywords: "",
    //         otherKeywords: "",
    //         tokens: 0,
    //     },
    // })

    const navigate = useNavigate();
    const location = useLocation();

    let expert = location.state.expert;

    const handleSubmit = e => {
        alert("nothing happens yet")
        // return navigate('/chatroom', { state: { expert: expert } })
    }


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
                        onClick={(e) => handleSubmit(e)}
                    >
                        CONTACT ME
                    </Button>

                </div>
            </div>
            <ChatRoom />
        </div>
    )
}


export default ExpertProfile;