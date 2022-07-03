import React, {Component} from 'react';
import AppBar from '@mui/material/AppBar';
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

const pages = ["Log In", "Sign Up"];
// const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
const open = Boolean(anchorEl);

class NavBar extends Component {

    constructor(props){
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <AppBar>
                <Container>
                    <Toolbar>
                        <Menu open={open}   >
                {pages.map((page) => (
                <MenuItem key={page} 
                // onClick={handleCloseNavMenu}  https://mui.com/material-ui/react-app-bar/#main-content
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
                        </Menu>
                    </Toolbar>
                <div>
                    Keep Going Logo
                </div>


                </Container>

            </AppBar>
        )
    }
}

export default NavBar