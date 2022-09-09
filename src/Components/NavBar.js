import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import logo from '../Logo Group.png';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import '../styles/navbar.css';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import MessageIcon from '@mui/icons-material/Message';
import { flexbox } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux' // dispatch actions to the store
import { userLogout } from '../store/actions/authActions';
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

function NavBar(props) {
    const [state, setState] = useState({
        user: {},
    })
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, authenticated, error, successMessage, user } = useSelector(state => state.auth);

    const logout = () => {
        dispatch(userLogout())
        navigate("/")
    }

    return (
        <AppBar style={styles.appbar}>
            <Toolbar style={styles.toolbar}>
                <div>
                    <RouterLink to="/"> <img src={logo} alt="logo" /></RouterLink>
                </div>
                <div style={styles.links}>
                    {authenticated ?

                        <div style={styles.links}><Button style={styles.menuButton}
                            onClick={() => logout()}
                        >Log Out</Button>
                            <div style={styles.links}>
                                {user.tokens} TOKENS
                            </div >
                            <RouterLink to={"/chat"}>
                                <MessageIcon style={styles.menuButton} />
                            </RouterLink>

                            <RouterLink to={"/profile"} style={{ textDecoration: "none" }}>
                                <Button style={styles.menuButton}>{user.username}</Button>
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

export default NavBar