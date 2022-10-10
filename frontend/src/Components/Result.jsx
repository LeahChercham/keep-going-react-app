import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, List, ListItem } from '@mui/material';
import Box from '@mui/material/Box';
import consts from '../consts';
const util = require('util')
const TAG_COLORS = consts.TAG_COLORS
const RANDOM_COLOR = consts.RANDOM_COLOR

const styles = {
    main: {
        display: "flex",
        flexFlow: "column",
    },
    box: {
        display: "flex",
        // backgroundColor: 'green',
        border: '4px solid black',
        minWidth: '400px',
        maxWidth: '400px',
        maxHeight: '400px',
        minHeight: '400px',
        alignItems: 'center',
        justifyContent: 'start',
        padding: '15px',

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
        width: "60%",
        marginBottom: "10px",
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

function Result(props) {
    const [state, setState] = useState({
        redirect: false,
        result: null
    })


    const handleSubmit = (e, expert) => {
        e.preventDefault();
        let redirect = true
        let result = expert
        setState({ ...state, redirect, result })

    }


    const { redirect, result } = state;
    const { kwList, setKwList } = useState([]);
    const navigate = useNavigate();

    // let keywordsList = props ? props.result.mainExpertiseKeywords.split(";") : []

    // useEffect(() => {
    //     debugger
    //     let kwList = props ? props.result.keywords.map(kw => { return kw.word }) : []
    // }, [props.result.keywords])

    useEffect(() => {
        if (redirect) {
            return navigate('/expert', { state: { expert: props.result } })
        }
    }, [redirect])

    return (
        <div style={styles.main}>
            <Box style={styles.box}>
                <div style={styles.username}>
                    {props.result.username}
                </ div>
                <div style={styles.expertise}>
                    {props.result.mainExpertise}
                </div>
                <div style={styles.keywords}>
                    {/* {props.result.mainExpertiseKeywords} */}
                    <li style={styles.li}>
                        {props.result.keywords.map(kw => { return <ul style={{ ...styles.ul, backgroundColor: RANDOM_COLOR(TAG_COLORS) }} key={kw.word}>{kw.word.toLowerCase()}</ul> })}

                    </li>
                </div>
                <Button onClick={(e) => handleSubmit(e, props.result)} style={styles.button}>
                    SEE MORE
                </Button>
                <div style={styles.tokens}>
                    1 Token / 15 Minutes
                </div>
            </Box>

        </div>
    )
}



export default Result;