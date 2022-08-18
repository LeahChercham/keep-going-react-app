import React, { Component } from 'react';
import AppBar from '@mui/material/AppBar';
import logo from '../Logo Group.png';
import { Link as RouterLink } from "react-router-dom";
import '../styles/navbar.css';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import MessageIcon from '@mui/icons-material/Message';
import { flexbox } from '@mui/system';

const pages = [{ label: "Sign In", href: "/register" }, { label: "Log In", href: "/login" }];

const styles = {
    appbar: { backgroundColor: "#0F202A", height: 100 },
    menuButton: {
        fontWeight: 500,
        size: "18px",
        color: "#FFFFFF",
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    links: {
        display: "flex",
        flex: "0 1 80%",
        alignItems: "center",
        justifyContent: "space-evenly",
    }
}

class NavBar extends Component {
    constructor() {
        super();
        this.state = {
        }
    }

    render() {
        return (
            <AppBar style={styles.appbar}>
                <Toolbar style={styles.toolbar}>
                    <div>
                        <RouterLink to="/"> <img src={logo} alt="logo" /></RouterLink>
                    </div>
                    <div style={styles.links}>
                        {this.props.isLoggedIn ?

                            <div style={styles.links}><Button style={styles.menuButton}
                                onClick={() => this.props.logout()}
                            >Log Out</Button>
                                <div style={styles.links}>
                                    {this.props.tokens} TOKENS
                                </div >
                                <MessageIcon style={styles.menuButton} />

                                <RouterLink to={"/profile"} style={{ textDecoration: "none" }}>
                                    <Button style={styles.menuButton}>{this.props.username}</Button>
                                </RouterLink>


                            </div>
                            :

                            (pages.map((page) => (
                                <RouterLink to={page.href} key={page.label} style={{ textDecoration: "none" }}>
                                    <Button style={styles.menuButton}>{page.label}</Button>
                                </RouterLink>)))}

                    </div>

                </Toolbar>

            </AppBar>
        )
    }
}

export default NavBar