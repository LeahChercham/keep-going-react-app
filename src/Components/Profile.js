import React, { Component } from 'react';
import { Link as RouterLink } from "react-router-dom";
import Button from '@mui/material/Button';
import landingImage from '../Image Landing.png';


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
    containerOne: {},
    containerTwo: {},

}
class Profile extends Component {
    constructor() {
        super();
        this.state = {
            status: "View" //modify or view

        }
    }

    render() {
        return (
            <div style={styles.main}>
                <div style={styles.containerOne}>

                </div>

                <div style={styles.containerTwo}>
            Set cell mode view or edit
                </div>
            </div>
        )
    }

}

export default Profile;