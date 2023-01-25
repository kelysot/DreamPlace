import React, { useState, useContext } from 'react'
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";

//MUI imports
import { Button, Typography, Grid, AppBar, Toolbar, Menu, MenuItem } from "@mui/material";

// Contexts
import StateContext from "../Contexts/StateContext";
import DispatchContext from "../Contexts/DispatchContext";

function Header() {
    const navigate = useNavigate();

    const GlobalState = useContext(StateContext);
    const GlobalDispatch = useContext(DispatchContext);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    async function handleLogout() {
        setAnchorEl(null);
        const confirmLogout = window.confirm("Are you sure you want to leave?");
        if (confirmLogout) {
            try {
                console.log(GlobalState.userToken)
                const response = await Axios.post('http://localhost:8000/api-auth-djoser/token/logout/',
                    GlobalState.userToken,
                    { headers: { 'Authorization': 'Token '.concat(GlobalState.userToken) } }
                );
                console.log(response);
                GlobalDispatch({ type: "logout" });
                navigate("/");
            } catch (error) {
                console.log(error.response)
            }
        }
    }

    return (
        <AppBar position="static" style={{ backgroundColor: "black" }}>
            <Toolbar>
                <div style={{ marginRight: "auto" }}>
                    <Button color="inherit" onClick={() => navigate('/')}><Typography variant="h4">Dream Place</Typography></Button>
                </div>
                <div>
                    <Button color="inherit" onClick={() => navigate('/listings')} style={{ marginRight: "2rem" }}><Typography variant="h6">Listings</Typography></Button>
                    <Button color="inherit" style={{ marginLeft: "2rem" }}><Typography variant="h6">Agencies</Typography></Button>
                </div>
                <div style={{ marginLeft: "auto", marginRight: "10rem" }}>
                    <Button onClick={() => navigate('/addproperty')}
                        style={{
                            backgroundColor: "green",
                            color: "white",
                            width: "15rem",
                            fontSize: "1.1rem",
                            marginRight: "1rem"
                        }}>
                        Add Property
                    </Button>

                    {GlobalState.userIsLogged ? (
                        <Button
                            onClick={handleClick}
                            // onClick={() => navigate('/login')}
                            style={{
                                backgroundColor: "white",
                                color: "black",
                                width: "15rem",
                                fontSize: "1.1rem",
                                marginRight: "1rem",
                                "&:hover": {
                                    backgroundColor: "green"
                                }
                            }}>
                            {GlobalState.userUsername}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => navigate('/login')}
                            style={{
                                backgroundColor: "white",
                                color: "black",
                                width: "15rem",
                                fontSize: "1.1rem",
                                marginRight: "1rem",
                                "&:hover": {
                                    backgroundColor: "green"
                                }
                            }}>
                            Login
                        </Button>)}

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleClose}
                            style={{
                                color: "black",
                                backgroundColor: "green",
                                width: "15rem",
                                fontWeight: "bolder",
                                borderRadius: "15px",
                                marginBottom: "0.25rem",
                            }}>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleLogout}
                            style={{
                                color: "black",
                                backgroundColor: "red",
                                width: "15rem",
                                fontWeight: "bolder",
                                borderRadius: "15px",
                            }}>
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default Header