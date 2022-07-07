import React, { Component } from 'react';
import { Link as RouterLink } from "react-router-dom";
import Button from '@mui/material/Button';
import landingImage from '../Image Landing.png';
import { Input } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


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

        }
    }

    render() {
        return (
            <div style={styles.main}>
                <div style={styles.header} >
                    Find the expert to help you keep your project going
                </div>
                <div style={styles.secondRow}>
                    <SearchIcon style={styles.icon} />
                    <div style={styles.inputDiv}>
                        <Input style={styles.input} type="search" placeholder="Try “React Native navigation”" />
                    </div>
                    <div style={styles.buttonDiv}>
                        <RouterLink to="/results" style={{ textDecoration: "none" }}>
                            <Button style={styles.menuButton}>Search</Button>
                        </RouterLink>
                    </div>
                </div>
            </div>
        )
    }

}

export default SearchPage;