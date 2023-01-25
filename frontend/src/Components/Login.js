import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Axios from "axios";
import { useImmerReducer } from "use-immer";

//MUI
import { Grid, AppBar, Typography, Button, Card, CardHeader, CardMedia, CardContent, CircularProgress, TextField } from "@mui/material";

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

        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

    function FormSubmit(e) {
        e.preventDefault();
        console.log('the form has been submitted')
        dispatch({ type: 'changeSendRequest' });
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
                    console.log(response);
                    dispatch({
                        type: 'catchToken',
                        tokenValue: response.data.auth_token,
                    });
                    GlobalDispatch({
                        type: 'catchToken',
                        tokenValue: response.data.auth_token,
                    })
                    // navigate('/')
                } catch (error) {
                    console.log(error.response);
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
                    console.log(response);
                    GlobalDispatch({
                        type: 'userSignIn',
                        usernameInfo: response.data.username,
                        emailInfo: response.data.email,
                        idInfo: response.data.id,
                    })
                    navigate('/')
                } catch (error) {
                    console.log(error.response);
                }
            }
            GetUserInfo();
            return () => {
                source.cancel();
            }
        }
    }, [state.token]);

    return (
        <div className="formContainer" style={{ width: "50%", marginLeft: "auto", marginRight: "auto", marginTop: "3rem", border: "5px solid black", padding: "3rem" }}>
            <form onSubmit={FormSubmit}>
                <Grid item container justifyContent={"center"}>
                    <Typography variant="h4">SIGN IN</Typography>
                </Grid>
                <Grid item container style={{ marginTop: "1rem" }}>
                    <TextField
                        id="username"
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={state.usernameValue}
                        onChange={(e) => dispatch({ type: 'catchUsernameChange', usernameChosen: e.target.value })}
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
                        onChange={(e) => dispatch({ type: 'catchPasswordChange', passwordChosen: e.target.value })}
                    />
                </Grid>
                <Grid item container xs={8} style={{ marginTop: "1rem", marginLeft: 'auto', marginRight: 'auto' }}>
                    <Button variant="contained" fullWidth type="submit" style={{ backgroundColor: "green", color: "white", fontSize: "1.1rem", marginRight: "1rem", "&:hover": { backgroundColor: "blue" } }}>
                        SIGN IN
                    </Button>
                </Grid>
            </form>
            <Grid item container justifyContent={"center"} style={{ marginTop: "1rem" }}>
                <Typography variant="small">
                    Don't have an account yet? <span onClick={() => navigate("/register")} style={{ cursor: "pointer", color: "green" }}>SIGN UP</span>
                </Typography>
            </Grid>
        </div>
    )
}

export default Login