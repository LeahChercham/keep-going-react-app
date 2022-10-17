import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { FormControl, Switch } from "@mui/material";
import { TextField } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux'
import { userUpdate } from '../store/actions/authActions'
import { TagsInput } from "react-tag-input-component";

const tagColors = ["#8CDFD6", "#1481BA", "#EEC584", "#2A7F62", "#BEA7E5", "#695958", "#B74F6F"]

const randomColor = () => {
    return tagColors[Math.floor(Math.random() * tagColors.length)];
}

const styles = {
    page: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        flexFlow: 'column'
    },
    main: {
        display: "flex",
        flexFlow: "column",
        justifyContent: "center",
        alignSelf: 'center',
        height: "100%",
        width: "60%",
        padding: "10px"
    },
    menuButton: {
        fontWeight: 500,
        fontSize: "1em",
        color: "#FFFFFF",
        backgroundColor: "#063A5B",
    },
    containerOne: {
        width: "100%",
        display: 'flex',
        justifyContent: 'space-between',
        flewFlow: "row-wrap"
    },
    containerTwo: {
        width: "100%",
        display: 'flex',
        flexFlow: "column",
        justifyContent: 'space-between'
    },
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
        margin: "1rem",
        borderRadius: "1rem",
    },
    button: {
        display: "flex",
        justifyContent: "center",
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

    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        let updateUser = user
        setState({ ...state, user, updateUser })
        let kw = []
        user.keywords.map(keyword => {
            kw.push(keyword.word.toLowerCase())
        })
        kw.length > 0 ? setTags(kw) : console.log('no keywords')
    }, [user])

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
        let oldKeywords = [...state.user.keywords]
        let username = { ...state.user.username }
        let data = { updateUser, username, oldKeywords }
        dispatch(userUpdate(data))
    }

    return (
        <div style={styles.page}>
            <FormControl style={styles.main} >
                <h1>Edit your profile</h1>
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
                            disabled={true}
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
                    <div>
                        <TextField
                            disabled={state.status === "View" ? true : true}
                            id="tokens"
                            label="Tokens"
                            value={state.updateUser.tokens}
                            margin="normal"
                            variant="outlined"
                            style={{ width: "100%" }}
                        />
                    </div>
                </div>

                <div style={styles.containerTwo}>


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
                    <div>
                        <h2>{state.status === "View" ? "Tags" : "Add Tags"}</h2>
                        <li style={styles.li}>
                            {tags.map((tag, index) => (
                                <ul style={{ ...styles.ul, backgroundColor: randomColor() }} key={index}>{tag.toLowerCase()}</ul>
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
                    </div>

                </div>
                <div style={styles.button}>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => handleSubmit(e)}>
                        {state.status === "View" ? "Edit" : "Save"}
                    </Button>

                </div>
                <div>
                    {state.error}
                </div>
            </FormControl>
        </div>
    )

}

export default Profile;