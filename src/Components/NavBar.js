import React, { Component } from 'react';
import AppBar from '@mui/material/AppBar';
import logo from '../Logo Group.png';
import { Link as RouterLink } from "react-router-dom";
import '../styles/navbar.css';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

const pages = [{ label: "Sign In", href: "/register" }, { label: "Log In", href: "/login" }];

const styles = {
    appbar: { backgroundColor: "#0F202A", height: 100 },
    menuButton: {
        fontWeight: 500,
        size: "18px",
        marginLeft: "38px",
        color: "#FFFFFF",
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
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
                    <div>
                        {this.props.isLoggedIn ?

                            <div><Button style={styles.menuButton}
                                onClick={() => this.props.logout()}
                            >Log Out</Button>

                                <RouterLink to={"/profile"} style={{ textDecoration: "none" }}>
                                    <Button style={styles.menuButton}>{this.props.username}</Button>
                                </RouterLink></div>
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