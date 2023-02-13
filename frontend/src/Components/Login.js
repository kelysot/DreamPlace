import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Axios from "axios";
import { useImmerReducer } from "use-immer";

//MUI
import {
    Grid, AppBar, Typography, Button, TextField, Alert, Snackbar
} from "@mui/material";

// Contexts
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";

function Login() {
    const navigate = useNavigate();

    const GlobalDispatch = useContext(DispatchContext);
    const GlobalState = useContext(StateContext);

    const initialState = {
        usernameValue: "",
        passwordValue: "",
        sendRequest: 0,
        token: "",
        openSnack: false,
        disabledBtn: false,
        serverError: false,
    }

    function ReducerFunction(draft, action) {
        // eslint-disable-next-line default-case
        switch (action.type) {
            case "catchUsernameChange":
                draft.usernameValue = action.usernameChosen;
                break;
            case "catchPasswordChange":
                draft.passwordValue = action.passwordChosen;
                break;
            case "changeSendRequest":
                draft.sendRequest = draft.sendRequest + 1;
                break;
            case "catchToken":
                draft.token = action.tokenValue;
                break;

            case "openTheSnack":
                draft.openSnack = true;
                break;

            case "disableTheButton":
                draft.disabledBtn = true;
                break;

            case "allowTheButton":
                draft.disabledBtn = false;
                break;

            case "catchServerError":
                draft.serverError = true;
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

    function FormSubmit(e) {
        e.preventDefault();

        dispatch({ type: 'changeSendRequest' });
        dispatch({ type: "disableTheButton" });
    }

    useEffect(() => {
        if (state.sendRequest) {
            const source = Axios.CancelToken.source(); // To prevent information leakage on a slow internet.
            async function SignIn() {
                try {
                    const response = await Axios.post('http://localhost:8000/api-auth-djoser/token/login/',
                        {
                            username: state.usernameValue,
                            password: state.passwordValue,
                        },
                        {
                            cancelToken: source.token
                        });
                    dispatch({
                        type: 'catchToken',
                        tokenValue: response.data.auth_token,
                    });
                    GlobalDispatch({
                        type: 'catchToken',
                        tokenValue: response.data.auth_token,
                    })
                } catch (error) {
                    dispatch({ type: "allowTheButton" });
                    dispatch({ type: "catchServerError" });
                }
            }
            SignIn();
            return () => {
                source.cancel();
            }
        }
    }, [state.sendRequest]);

    //Get user info
    useEffect(() => {
        if (state.token !== '') {
            const source = Axios.CancelToken.source(); // To prevent information leakage on a slow internet.
            async function GetUserInfo() {
                try {
                    const response = await Axios.get('http://localhost:8000/api-auth-djoser/users/me/',
                        {
                            headers: { 'Authorization': 'Token '.concat(state.token) }
                        },
                        {
                            cancelToken: source.token
                        });
                    GlobalDispatch({
                        type: 'userSignIn',
                        usernameInfo: response.data.username,
                        emailInfo: response.data.email,
                        idInfo: response.data.id,
                    })
                    dispatch({ type: "openTheSnack" });
                    // navigate('/')
                } catch (error) {
                }
            }
            GetUserInfo();
            return () => {
                source.cancel();
            }
        }
    }, [state.token]);

    useEffect(() => {
        if (state.openSnack) {
            setTimeout(() => {
                navigate("/");
            }, 1000);
        }
    }, [state.openSnack]);

    return (
        <div
            style={{
                width: "50%",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "3rem",
                border: "5px solid black",
                padding: "3rem",
            }}
        >
            <form onSubmit={FormSubmit}>
                <Grid item container justifyContent="center">
                    <Typography variant="h4">SIGN IN</Typography>
                </Grid>

                {state.serverError ? (
                    <Alert severity="error">Incorrect username or password!</Alert>
                ) : (
                    ""
                )}

                <Grid item container style={{ marginTop: "1rem" }}>
                    <TextField
                        id="username"
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={state.usernameValue}
                        onChange={(e) =>
                            dispatch({
                                type: "catchUsernameChange",
                                usernameChosen: e.target.value,
                            })
                        }
                        error={state.serverError ? true : false}
                    />
                </Grid>

                <Grid item container style={{ marginTop: "1rem" }}>
                    <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value={state.passwordValue}
                        onChange={(e) =>
                            dispatch({
                                type: "catchPasswordChange",
                                passwordChosen: e.target.value,
                            })
                        }
                        error={state.serverError ? true : false}
                    />
                </Grid>

                <Grid
                    item
                    container
                    xs={8}
                    style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
                >
                    <Button
                        variant="contained"
                        fullWidth
                        type="submit"
                        style={{
                            backgroundColor: "green",
                            color: "white",
                            fontSize: "1.1rem",
                            marginLeft: "1rem",
                            // "&:hover": {
                            // 	backgroundColor: "blue",
                            // },
                        }}
                        disabled={state.disabledBtn}
                    >
                        SIGN IN
                    </Button>
                </Grid>
            </form>

            <Grid
                item
                container
                justifyContent="center"
                style={{ marginTop: "1rem" }}
            >
                <Typography variant="small">
                    Don't have an account yet?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        style={{ cursor: "pointer", color: "green" }}
                    >
                        SIGN UP
                    </span>
                </Typography>
            </Grid>
            <Snackbar
                open={state.openSnack}
                message="You have successfully logged in"
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            />
        </div>
    );
}

export default Login