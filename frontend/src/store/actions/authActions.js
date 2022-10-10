import Axios from 'axios';
import consts from '../../consts'
import { AUTH_FAIL, AUTH_SUCCESS, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_LOGOUT, USER_UPDATE_SUCCESS, USER_GET_FAIL, USER_GET_SUCCESS, USER_UPDATE_FAIL } from '../types/authType';
const CREATE_ROUTE = consts.CREATE_ROUTE

export const userRegister = (user) => {

    return async (dispatch) => {

        try {
            const response = await Axios.post(CREATE_ROUTE("user"), user)
            dispatch({
                type: AUTH_SUCCESS,
                payload: {
                    successMessage: response.data.successMessage,
                    user: response.data.user,
                }
            })
        } catch (error) {
            dispatch({
                type: AUTH_FAIL,
                payload: { error: error.response.data.error.errorMessage }
            })
        }

    }
}

export const userLogin = (data) => {
    let { username, password } = data
    if (!password) { alert("Please enter your password.") }
    if (!username) { alert("Please enter your username.") }

    return async dispatch => {
        try {
            let response = await Axios.get(CREATE_ROUTE(`login/${username}/${password}`)) // asynchronous function
            console.log("in user Update");
            console.log(response.data)
            if(response.data.error){
                dispatch({
                    type: USER_LOGIN_FAIL,
                    payload: {
                        error: response.data.error.errorMessage
                    }
                })
            } else {
                let login = { isLoggedIn: true, user: response.data.user }
                localStorage.login = JSON.stringify(login)
    
                dispatch({
                    type: USER_LOGIN_SUCCESS,
                    payload: {
                        successMessage: response.data.successMessage,
                        user: response.data.user
                    }
                })
            }

        }
        catch (error) {
            dispatch({
                type: USER_LOGIN_FAIL,
                payload: {
                    error: error.response.data.error.errorMessage
                }
            })
        }

    }

}

export const userLogout = () => {
    localStorage.clear()
    return dispatch => dispatch({ type: USER_LOGOUT })
}

export const userUpdate = (data) => {
    let updateUser = data.updateUser
    let username = updateUser.username
    let oldKeywords = data.oldKeywords

    let transferData = {
        updateUser,
        oldKeywords
    }

    return async dispatch => {
        try {
            let response = await Axios.put(CREATE_ROUTE(`user/${username}`), transferData)

            dispatch({
                type: USER_UPDATE_SUCCESS,
                payload: {
                    successMessage: response.data.successMessage,
                    user: response.data.user
                }
            })
        }
        catch (error) {
            dispatch({
                type: USER_UPDATE_FAIL,
                payload: {
                    error: error.response.data.error.errorMessage
                }
            })
        }
    }
}

export const userGet = (user) => {
    let { username } = user
    return async dispatch => {
        try {
            let response = await Axios.get(CREATE_ROUTE(`user/username/${username}`))
            dispatch({
                type: USER_GET_SUCCESS,
                payload: {
                    successMessage: "success",
                    user: response.data
                }
            })
        } catch (error) {
            dispatch({
                type: USER_GET_FAIL,
                payload: {
                    error: error.response.data.error.errorMessage
                }
            })
        }

    }

}