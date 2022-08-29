import Axios from 'axios';
import consts from '../../consts'
import { AUTH_FAIL, AUTH_SUCCESS, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, CLEAR_ERROR, USER_LOGOUT } from '../types/authType';
const CREATE_ROUTE = consts.CREATE_ROUTE

export const userRegister = (user) => {

    return async (dispatch) => {

        try {
            const response = await Axios.post(CREATE_ROUTE("user"), user)
            // console.log(response)
            dispatch({
                type: AUTH_SUCCESS,
                payload: {
                    successMessage: response.data.successMessage,
                    user: response.data.user,
                }
            })
        } catch (error) {
            // console.log(error.response.data)
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
            let login = { isLoggedIn: true, user: response.data.user }
            localStorage.login = JSON.stringify(login)

            console.log(response.data)
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: {
                    successMessage: response.data.successMessage,
                    user: response.data.user
                }
            })
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

export const userLogout = (user) => { }