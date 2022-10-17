import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import logo from '../Logo Group.png';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import MessageIcon from '@mui/icons-material/Message';
import { useDispatch, useSelector } from 'react-redux' 
import { userLogout } from '../store/actions/authActions';
import { messengerActionLogOut } from '../store/actions/messengerAction';
import { offerActionLogOut } from '../store/actions/offerAction';
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
    },
    linksBox: {
        display: 'flex',
        width: "100%",
        alignItems: "center",
        justifyContent: "space-evenly"
    }
}

function NavBar(props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {  authenticated, user } = useSelector(state => state.auth);

    const logout = () => {
        dispatch(userLogout())
        dispatch(messengerActionLogOut())
        dispatch(offerActionLogOut)
        navigate("/")
    }



    return (
        <AppBar style={styles.appbar}>
            <Toolbar style={styles.toolbar}>
                <div>
                    <RouterLink to="/"> <img src={logo} alt="logo" /></RouterLink>
                </div>
                {authenticated ?
                    <span style={styles.linksBox}>
                        <Button style={styles.menuButton}
                            onClick={() => logout()}
                        >Log Out</Button>
                        <span >
                            {user ? user.tokens : null} TOKENS
                        </span >
                        <RouterLink to={"/chat"}>
                            <MessageIcon style={styles.menuButton} />
                        </RouterLink>

                        <RouterLink to={"/profile"} style={{ textDecoration: "none" }}>
                            <Button style={styles.menuButton}>{user ? user.username : null}</Button>
                        </RouterLink>
                    </span>
                    :
                    <div style={styles.linksBox}>{

                        (pages.map((page) => (
                            <RouterLink to={page.href} key={page.label} style={{ textDecoration: "none" }}>
                                <Button style={styles.menuButton}>{page.label}</Button>
                            </RouterLink>)))
                    }
                    </div>}
            </Toolbar>

        </AppBar>
    )

}

export default NavBar;