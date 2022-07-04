import React, { Component } from 'react';
import AppBar from '@mui/material/AppBar';
import logo from '../Logo Group.png';
import { Link as RouterLink } from "react-router-dom";
import '../styles/navbar.css';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

const pages = [{ label: "Sign In", href: "/register" }, { label: "Log In", href: "/login" }, { label: "Username", href: "/search" }];

const styles = {
    appbar: { backgroundColor: "#0F202A", height:100 },
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

    constructor(props) {
        super(props);
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
                        {pages.map((page) => (
                            <RouterLink to={page.href} key={page.label} style={{textDecoration:"none"}}>
                                <Button style={styles.menuButton}>{page.label}</Button>
                            </RouterLink>))}

                    </div>

                </Toolbar>

            </AppBar>
        )
    }
}

export default NavBar