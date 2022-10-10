import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import { FormControl, Switch } from "@mui/material";
import { TextField } from "@mui/material";
import { FormHelperText } from "@mui/material";
import Axios from 'axios';
import consts from '../consts'
const TAG_COLORS = consts.TAG_COLORS
const RANDOM_COLOR = consts.RANDOM_COLOR
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
    },
    li: {
        listStyle: "none",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: "10px",
    },
    ul: {
        display: "inline",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        listStyle: "none",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: "2rem",
        backgroundColor: "green",
        margin: "0.5rem",
        borderRadius: "0.5rem",
    },

}
function ExpertProfile(props) {

    const navigate = useNavigate();
    const location = useLocation();

    let expert = location.state.expert;

    const handleSubmit = e => {
        return navigate('/chat', { state: { expert: expert } })
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
                    <li style={styles.li}>
                        {expert.keywords.map(kw => { return <ul style={{ ...styles.ul, backgroundColor: RANDOM_COLOR(TAG_COLORS) }} key={kw.word}>{kw.word.toLowerCase()}</ul> })}

                    </li>
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
        </div>
    )
}


export default ExpertProfile;