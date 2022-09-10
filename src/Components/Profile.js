import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { FormControl, Switch } from "@mui/material";
import { TextField } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux'
// import consts from '../consts'
import { userUpdate } from '../store/actions/authActions'
import { TagsInput } from "react-tag-input-component";

const tagColors = ["#8CDFD6", "#1481BA", "#EEC584", "#2A7F62", "#BEA7E5", "#695958", "#B74F6F"]

const randomColor = () => {
    return tagColors[Math.floor(Math.random() * tagColors.length)];
}

const styles = {
    main: {
        display: "flex",
        flexFlow: "row",
        justifyContent: "center",
        height: "100%",
    },
    menuButton: {
        fontWeight: 500,
        fontSize: "1em",
        color: "#FFFFFF",
        backgroundColor: "#063A5B",
    },
    containerOne: {},
    containerTwo: {},
    li: {
        listStyle: "none",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
    },
    ul: {
        display: "inline",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        listStyle: "none",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: "2.5rem",
        // backgroundColor: "green",
        margin: "1rem",
        borderRadius: "1rem",
    },
    button: {
        marginTop: "2rem",

    }

}

function Profile(props) {

    const [state, setState] = useState({
        status: "View",
        user: {
            email: "",
            password: "",
            username: "",
            usernameTaken: false,
            emailTaken: false,
            mainExpertise: "",
            mainExpertiseKeywords: "",
            keywords: [],
            otherKeywords: "",
            tokens: 0,
        },
        updateUser: {
            email: "",
            password: "",
            username: "",
            usernameTaken: false,
            emailTaken: false,
            mainExpertise: "",
            mainExpertiseKeywords: "",
            keywords: [],
            otherKeywords: "",
            tokens: 0,
        }
    })
    const [tags, setTags] = useState([])
    const [expertiseTag, setExpertiseTag] = useState([])

    const dispatch = useDispatch();

    const { loading, authenticated, error, successMessage, user } = useSelector(state => state.auth);

    useEffect(() => {
        let updateUser = user
        setState({ ...state, user, updateUser })
    }, [])


    const handleChange = (event) => {
        let updateUser = { ...state.updateUser }
        updateUser[event.target.id] = event.target.value
        setState({ ...state, updateUser })
    }

    const handleSubmit = (event) => {
        let status = state.status
        event.preventDefault();

        switch (status) {
            case "View": {
                status = "Edit"
                setState({ ...state, status })
            }; break;
            case "Edit": {
                updateUser()
                // hier zu DB schicken
                status = "View"
                setState({ ...state, status })
            }; break;
            default:
                break;
        }
    }

    const updateUser = () => {
        let updateUser = { ...state.updateUser }
        updateUser.keywords = tags
        let username = { ...state.user.username }
        let data = { updateUser, username }
        debugger
        dispatch(userUpdate(data))
    }

    return (
        <div>
            <FormControl style={styles.main} >
                <div style={styles.main}>
                    <div style={styles.containerOne}>
                        <div>
                            <TextField
                                disabled={true}
                                error={state.updateUser.usernameTaken}
                                id="username"
                                label="Username"
                                value={state.updateUser.username}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />
                            <FormHelperText id="my-helper-text">{state.updateUser.usernameTaken ? "Username already taken" : ""}</FormHelperText>
                        </div>
                        <div>
                            <TextField
                                disabled={state.status === "View" ? true : false}
                                error={state.updateUser.emailTaken}
                                id="email"
                                label="Email"
                                value={state.updateUser.email}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />
                            <FormHelperText id="my-helper-text">{state.updateUser.emailTaken ? "An account with this e-mail address already exists" : ""}</FormHelperText>
                        </div>
                    </div>

                    <div style={styles.containerTwo}>

                        <div>
                            <TextField
                                disabled={state.status === "View" ? true : true} // always disabled
                                id="tokens"
                                label="Tokens"
                                value={state.updateUser.tokens}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />
                            {/* <FormHelperText id="my-helper-text"></FormHelperText> */}
                        </div>
                        <div>
                            <TextField
                                disabled={state.status === "View" ? true : false}
                                id="mainExpertise"
                                label="Expertise"
                                value={state.updateUser.mainExpertise}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            />

                            {/* <div>Enter Keywords separated by semicolons ;</div> */}
                            {/* Hier vorschläge für schon existierende Stichwörter vorschlagen */}
                            {/* <TextField
                                multiline
                                disabled={state.status === "View" ? true : false}
                                id="mainExpertiseKeywords"
                                label="Keywords"
                                value={state.updateUser.mainExpertiseKeywords}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                                style={{ width: "100%" }}
                            /> */}
                            {/* Npm Package react-tag-input-component
  */}
                            <div>
                                <h1>{state.status === "View" ? "Tags" : "Add Tags"}</h1>
                                <li style={styles.li}>
                                    {tags.map((tag, index) => (
                                        <ul style={{ ...styles.ul, backgroundColor: randomColor() }} backgroundColor={randomColor()} key={index}>{tag}</ul>
                                    ))}

                                </li>
                                {state.status === "View" ? null : <div><TagsInput
                                    value={tags}
                                    onChange={setTags}
                                    name="tags"
                                    placeHolder="enter tags"
                                />
                                    <em>press enter to add new tag</em> </div>
                                }
                                {/* <TagsInput
                                    value={tags}
                                    onChange={setTags}
                                    name="tags"
                                    placeHolder="enter tags"
                                /> */}
                            </div>

                        </div>

                        <div style={styles.button}>

                            <Button
                                variant="contained"
                                color="primary"
                                // currentStatus="Edit"
                                onClick={(e) => handleSubmit(e)}>
                                {state.status === "View" ? "Edit" : "Save"}
                            </Button>

                        </div>
                        <div>
                            {state.error}
                        </div>
                    </div>
                </div>
            </FormControl>
        </div>
    )

}

export default Profile;