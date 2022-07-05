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
        backgroundColor: "#0F202A"
    },
    secondColumn:{
        justifyContent: "center",
        display: "flex",
        flexFlow: "column"
    },
    text: {
        header: {
            color: "white",
            fontSize: "4em",
             flex: "0 1 20%",
        },
        body: {
            color: "white",
            fontSize: "2em",
             flex: "0 1 20%",
        }
    },
    menuButton: {
        fontWeight: 500,
        fontSize: "1em",
        color: "#FFFFFF",
        backgroundColor: "#063A5B",
    },
    image: {
        flex: "0 1 40%",
    }

}
class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div style={styles.main}>
                <div style={styles.image} >
                    <img src={landingImage} style={{ maxHeight: "99%" }} alt="racket image" />
                </div>
                <div style={styles.secondColumn}>

                    <div style={styles.text.header}>
                        Keep going !
                    </div>
                    <div style={styles.text.body}>
                        Find the expert to free your potential while building your online business
                    </div>
                    <div>
                        <RouterLink to="/register" style={{ textDecoration: "none" }}>
                            <Button style={styles.menuButton}>Sign up now</Button>
                        </RouterLink>
                    </div>
                </div>
            </div>
        )
    }

}

export default LandingPage;